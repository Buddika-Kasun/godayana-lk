package com.godayana.otp.service;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.otp.dto.SendOtpRequest;
import com.godayana.otp.dto.VerifyOtpRequest;
import com.godayana.otp.entity.OtpCode;
import com.godayana.otp.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;
    private final EsmsService esmsService;

    @Value("${otp.length:4}")
    private int otpLength;

    @Value("${otp.expiration-minutes:5}")
    private int expirationMinutes;

    @Value("${otp.max-attempts:3}")
    private int maxAttempts;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void sendOtp(SendOtpRequest request) {
        log.info("=== SEND OTP CALLED ===");
        log.info("Identifier: {}, Channel: {}, Purpose: {}",
                request.getIdentifier(), request.getChannel(), request.getPurpose());

        // Check for recent OTP (prevents duplicates within 60 seconds)
        Optional<OtpCode> recentOtp = otpRepository
                .findTopByIdentifierAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
                        request.getIdentifier(), request.getPurpose());

        if (recentOtp.isPresent() &&
                recentOtp.get().getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(60))) {
            log.warn("Recent OTP found for {}, reusing existing OTP (within 60s)", request.getIdentifier());

            // Re-send the existing OTP asynchronously
            if ("EMAIL".equalsIgnoreCase(request.getChannel())) {
                sendEmailAsync(request.getIdentifier(), recentOtp.get().getCode());
            } else if ("SMS".equalsIgnoreCase(request.getChannel())) {
                sendSmsAsync(request.getIdentifier(), recentOtp.get().getCode());
            }
            return;
        }

        // Delete old OTPs
        otpRepository.deleteExpiredOtpsForIdentifier(request.getIdentifier(), request.getPurpose());

        // Generate and save new OTP
        String otpCode = generateOtp();
        OtpCode otp = OtpCode.builder()
                .identifier(request.getIdentifier())
                .code(otpCode)
                .purpose(request.getPurpose())
                .expiresAt(LocalDateTime.now().plusMinutes(expirationMinutes))
                .verified(false)
                .attempts(0)
                .createdAt(LocalDateTime.now())
                .build();

        otp = otpRepository.save(otp);
        log.info("OTP saved with ID: {}", otp.getId());

        // Send email ASYNCHRONOUSLY
        if ("EMAIL".equalsIgnoreCase(request.getChannel())) {
            sendEmailAsync(request.getIdentifier(), otpCode);
        } else if ("SMS".equalsIgnoreCase(request.getChannel())) {
            sendSmsAsync(request.getIdentifier(), otpCode);
        }

        // Return immediately - email will be sent in background
        log.info("OTP send initiated for: {} via {}", request.getIdentifier(), request.getChannel());
    }

    @Async("emailExecutor")
    public void sendEmailAsync(String email, String otpCode) {
        sendEmail(email, otpCode);
    }

    @Async("smsExecutor")
    public void sendSmsAsync(String phoneNumber, String otpCode) {
        sendSms(phoneNumber, otpCode);
    }

    private boolean sendEmail(String email, String otpCode) {
        try {
            log.info("Sending OTP {} to email: {}", otpCode, email);

            if (fromEmail == null || fromEmail.isEmpty()) {
                log.warn("From email not configured, logging OTP instead");
                System.out.println("========== EMAIL OTP (No Mail Config) ==========");
                System.out.println("To: " + email);
                System.out.println("OTP: " + otpCode);
                System.out.println("================================================");
                return true;
            }

            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(email);
                message.setSubject("Godayana.lk - Email Verification Code");
                message.setText(String.format(
                        "Your verification code is: %s%n%n" +
                                "This code will expire in %d minutes.%n%n" +
                                "If you didn't request this, please ignore this email.",
                        otpCode, expirationMinutes
                ));
                mailSender.send(message);
                log.info("Email OTP sent successfully to: {}", email);
                return true;
            } catch (Exception e) {
                log.error("Failed to send email via SMTP: {}", e.getMessage());
                // Log OTP as fallback
                System.out.println("========== EMAIL OTP (SMTP Fallback) ==========");
                System.out.println("To: " + email);
                System.out.println("OTP: " + otpCode);
                System.out.println("================================================");
                return true;
            }
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
            return true;
        }
    }

    private boolean sendSms(String phoneNumber, String otpCode) {
        try {
            log.info("Sending OTP {} to phone: {}", otpCode, phoneNumber);

            // Format phone number
            String formattedNumber = phoneNumber;
            if (!phoneNumber.startsWith("94")) {
                // Remove leading 0 if present
                if (phoneNumber.startsWith("0")) {
                    formattedNumber = phoneNumber.substring(1);
                }
                formattedNumber = "94" + formattedNumber;
            }

            // Create SMS message
            String message = String.format(
                    "Your Godayana.lk verification code is: %s.\nValid for %d minutes. \n*StopAd?SMS NO Godayana.lk to +94717781111",
                    otpCode, expirationMinutes
            );

            // Send via ESMS
            boolean sent = esmsService.sendSms(formattedNumber, message);

            if (sent) {
                log.info("SMS OTP sent successfully to: {}", phoneNumber);
                return true;
            } else {
                log.error("Failed to send SMS to: {}", phoneNumber);
                // Fallback: Log OTP
                System.out.println("========== SMS OTP (Fallback) ==========");
                System.out.println("To: " + phoneNumber);
                System.out.println("OTP: " + otpCode);
                System.out.println("========================================");
                return true;
            }

        } catch (Exception e) {
            log.error("Failed to send SMS: {}", e.getMessage());
            // Fallback: Log OTP
            System.out.println("========== SMS OTP (Error Fallback) ==========");
            System.out.println("To: " + phoneNumber);
            System.out.println("OTP: " + otpCode);
            System.out.println("Error: " + e.getMessage());
            System.out.println("==============================================");
            return true;
        }
    }

    private String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        return otp.toString();
    }

    @Transactional
    public boolean verifyOtp(VerifyOtpRequest request) {
        OtpCode otp = otpRepository.findTopByIdentifierAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
                request.getIdentifier(), request.getPurpose()
        ).orElseThrow(() -> new BusinessException(
                "OTP not found or already verified",
                ErrorCode.VALIDATION_ERROR.getCode(),
                HttpStatus.SC_OK
        ));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otp);
            throw new BusinessException(
                    "OTP has expired",
                    ErrorCode.INVALID_OTP.getCode(),
                    HttpStatus.SC_OK
            );
        }

        if (otp.getAttempts() >= maxAttempts) {
            otpRepository.delete(otp);
            throw new BusinessException(
                    "Maximum attempts exceeded",
                    ErrorCode.VALIDATION_ERROR.getCode(),
                    HttpStatus.SC_OK
            );
        }

        otp.setAttempts(otp.getAttempts() + 1);

        if (otp.getCode().equals(request.getCode())) {
            otp.setVerified(true);
            otpRepository.save(otp);
            log.info("OTP verified successfully for: {}", request.getIdentifier());
            return true;
        }

        otpRepository.save(otp);

        throw new BusinessException(
                "Invalid OTP code",
                ErrorCode.INVALID_OTP.getCode(),
                HttpStatus.SC_OK
        );
    }

    @Transactional
    public void cleanupExpiredOtps() {
        otpRepository.deleteExpiredOtps(LocalDateTime.now());
        log.info("Cleaned up expired OTPs");
    }
}