package com.godayana.otp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.godayana.otp.config.EsmsProperties;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

@Service
@RequiredArgsConstructor
@Slf4j
public class EsmsService {

    private final EsmsProperties esmsProperties;
    private boolean esmsAvailable = false;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String ESMS_API_URL =
            "https://msmsenterpriseapi.mobitel.lk/mSMSEnterpriseAPI/esmsproxyURL.php";

    @PostConstruct
    public void init() {
        log.info("Initializing ESMS Service...");
        try {
            disableSSLVerification();

            log.info("ESMS Username: {}", esmsProperties.getUsername());
            log.info("ESMS Password: {}", esmsProperties.getPassword() != null ? "***SET***" : "NULL");
            log.info("ESMS Sender Alias: {}", esmsProperties.getSenderAlias());

            // Just mark as available, don't send test message
            esmsAvailable = true;
            log.info("ESMS Service initialized successfully.");

        } catch (Exception e) {
            esmsAvailable = false;
            log.error("Failed to initialize ESMS Service: {}", e.getMessage(), e);
        }
    }

    private void disableSSLVerification() {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        public X509Certificate[] getAcceptedIssuers() { return null; }
                        public void checkClientTrusted(X509Certificate[] certs, String authType) { }
                        public void checkServerTrusted(X509Certificate[] certs, String authType) { }
                    }
            };

            SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

            log.debug("SSL verification disabled");
        } catch (Exception e) {
            log.warn("Failed to disable SSL verification: {}", e.getMessage());
        }
    }

    public boolean sendSms(String phoneNumber, String message) {
        return sendSms(phoneNumber, message, esmsProperties.getSenderAlias());
    }

    public boolean sendSms(String phoneNumber, String message, String senderAlias) {
        List<String> recipients = new ArrayList<>();
        recipients.add(phoneNumber);
        return sendSmsBatch(recipients, message, senderAlias);
    }

    public boolean sendSmsBatch(List<String> phoneNumbers, String message) {
        return sendSmsBatch(phoneNumbers, message, esmsProperties.getSenderAlias());
    }

    public boolean sendSmsBatch(List<String> phoneNumbers, String message, String senderAlias) {
        try {
            if (message == null || message.isEmpty()) {
                log.error("Message cannot be empty");
                return false;
            }

            if (message.length() > 160) {
                log.warn("Message exceeds 160 characters, may be split into multiple messages");
            }

            List<String> validNumbers = new ArrayList<>();
            for (String number : phoneNumbers) {
                String formattedNumber = formatPhoneNumber(number);
                if (formattedNumber != null) {
                    validNumbers.add(formattedNumber);
                }
            }

            if (validNumbers.isEmpty()) {
                log.error("No valid phone numbers to send SMS");
                return false;
            }

            // Send in batches of 500
            List<List<String>> batches = partition(validNumbers, 500);
            boolean allSent = true;

            for (List<String> batch : batches) {
                boolean sent = sendBatch(batch, message, senderAlias);
                allSent = allSent && sent;
            }

            return allSent;

        } catch (Exception e) {
            log.error("Failed to send SMS: {}", e.getMessage(), e);
            return false;
        }
    }

    private boolean sendBatch(List<String> recipients, String message, String senderAlias) {
        try {
            Map<String, Object> request = new LinkedHashMap<>();
            request.put("username", esmsProperties.getUsername());
            request.put("password", esmsProperties.getPassword());
            request.put("from", senderAlias);
            request.put("to", String.join(",", recipients));
            request.put("text", message);
//            request.put("messageType", esmsProperties.getMessageType());

            String response = sendRequest(request);
            log.debug("ESMS Response: {}", response);

            if (response != null && response.contains("\"resultcode\":\"200\"")) {
                log.info("✅ SMS sent successfully to {} recipients", recipients.size());
                return true;
            } else {
                log.error("❌ ESMS returned error: {}", response);
                return false;
            }

        } catch (Exception e) {
            log.error("Failed to send SMS batch: {}", e.getMessage(), e);
            return false;
        }
    }

    private String sendRequest(Map<String, Object> request) {
        HttpURLConnection conn = null;
        try {
            String jsonInput = objectMapper.writeValueAsString(request);
            log.debug("Sending JSON: {}", jsonInput);

            URL url = new URL(ESMS_API_URL);
            conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json, text/plain, */*");
            conn.setRequestProperty("Accept-Language", "en-US,en;q=0.9");
            conn.setRequestProperty("Connection", "keep-alive");
            conn.setRequestProperty("User-Agent", "Godayana-OTP-Service/1.0");

            conn.setDoOutput(true);
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInput.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();

            StringBuilder response = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }

            String responseBody = response.toString();
            log.debug("Response code: {}, Body: {}", responseCode, responseBody);

            return responseBody;

        } catch (Exception e) {
            log.error("ESMS request failed: {}", e.getMessage(), e);
            if (conn != null) {
                try {
                    try (BufferedReader br = new BufferedReader(
                            new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8))) {
                        StringBuilder errorResponse = new StringBuilder();
                        String line;
                        while ((line = br.readLine()) != null) {
                            errorResponse.append(line.trim());
                        }
                        log.error("Error response: {}", errorResponse);
                        return errorResponse.toString();
                    }
                } catch (Exception ignored) {}
            }
            return null;
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return null;
        }

        String cleaned = phoneNumber.replaceAll("[^0-9]", "");

        if (cleaned.startsWith("0")) {
            cleaned = cleaned.substring(1);
        }

        if (!cleaned.startsWith("94")) {
            cleaned = "94" + cleaned;
        }

        if (cleaned.length() > 11) {
            cleaned = cleaned.substring(cleaned.length() - 11);
        }

        if (cleaned.length() != 11) {
            log.warn("Invalid phone number length: {} for number: {}", cleaned, phoneNumber);
            return null;
        }

        return cleaned;
    }

    private <T> List<List<T>> partition(List<T> list, int size) {
        List<List<T>> partitions = new ArrayList<>();
        for (int i = 0; i < list.size(); i += size) {
            partitions.add(list.subList(i, Math.min(i + size, list.size())));
        }
        return partitions;
    }

    public boolean isEsmsAvailable() {
        return esmsAvailable;
    }

    public boolean isSessionActive() {
        return esmsAvailable;
    }

    public void renewSessionIfNeeded() {
        // No-op for REST API
    }

    public String getServiceStatus() {
        try {
            if (!esmsAvailable) {
                return "NOT_AVAILABLE - Please check credentials and network connectivity";
            }
            return "AVAILABLE - Ready to send SMS";
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }

    public Map<String, Object> testCredentials() {
        Map<String, Object> result = new HashMap<>();
        result.put("username", esmsProperties.getUsername());
        result.put("passwordSet", esmsProperties.getPassword() != null && !esmsProperties.getPassword().isEmpty());
        result.put("senderAlias", esmsProperties.getSenderAlias());

        try {
            Map<String, Object> request = new LinkedHashMap<>();
            request.put("username", esmsProperties.getUsername());
            request.put("password", esmsProperties.getPassword());
            request.put("from", esmsProperties.getSenderAlias());
            request.put("to", "94715315915");
            request.put("text", "Test msg");

            String response = sendRequest(request);
            result.put("responseBody", response);

            if (response != null && response.contains("\"resultcode\":\"200\"")) {
                result.put("valid", true);
                result.put("resultMessage", "✅ SUCCESS - Credentials are valid");
                esmsAvailable = true;
            } else {
                result.put("valid", false);
                result.put("resultMessage", "❌ API returned: " + response);
            }

            result.put("timestamp", LocalDateTime.now().toString());

        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("valid", false);
            result.put("resultMessage", "❌ Exception: " + e.getMessage());
        }

        return result;
    }

    public void debugSession() {
        log.info("=== ESMS Session Debug ===");
        log.info("ESMS Available: {}", esmsAvailable);
        log.info("ESMS API URL: {}", ESMS_API_URL);
        log.info("Username: {}", esmsProperties.getUsername());
        log.info("Sender Alias: {}", esmsProperties.getSenderAlias());
        log.info("=================================");
    }
}