package com.godayana.auth.service;

import com.godayana.auth.dto.LoginRequest;
import com.godayana.auth.dto.LoginResponse;
import com.godayana.auth.dto.RegisterRequest;
import com.godayana.auth.dto.UserResponse;
import com.godayana.auth.entity.User;
import com.godayana.auth.repository.UserRepository;
import com.godayana.auth.service.interfaces.IAuthService;
import com.godayana.dto.ApiResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.security.JwtUtil;
import io.netty.handler.timeout.TimeoutException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final WebClient.Builder webClientBuilder;

    @Value("${otp.service.url}")
    private String otpServiceUrl;

    @Value("${notification.service.url}")
    private String notificationServiceUrl;

    @Value("${user.service.url}")
    private String userServiceUrl;

    @Value("${file.service.url}")
    private String fileServiceUrl;

//    @Override
//    @Transactional
//    public Map<String, String> initiateRegistration(RegisterRequest request) {
//        // Check if user already exists
//        if (userRepository.existsByPhone(request.getPhone())) {
//            throw new BusinessException(
//                    "Phone number already registered",
//                    ErrorCode.DUPLICATE_RESOURCE.getCode(),
//                    HttpStatus.SC_CONFLICT
//            );
//            //throw new DuplicateResourceException("User", "phone", request.getPhone());
//        }
//
//        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
//            throw new BusinessException(
//                    "Email already registered",
//                    ErrorCode.DUPLICATE_RESOURCE.getCode(),
//                    HttpStatus.SC_CONFLICT
//            );
//            //throw new DuplicateResourceException("User", "email", request.getEmail());
//        }
//
//        // Send OTP based on role
//        String identifier = "seeker".equals(request.getRole()) ? request.getPhone() : request.getEmail();
//        String channel = "seeker".equals(request.getRole()) ? "SMS" : "EMAIL";
//
//        try {
//            webClientBuilder.build()
//                    .post()
//                    .uri(otpServiceUrl + "/api/v1/otp/send")
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .bodyValue(Map.of(
//                            "identifier", identifier,
//                            "channel", channel,
//                            "purpose", "REGISTRATION"
//                    ))
//                    .retrieve()
//                    .bodyToMono(Void.class)
//                    .block();
//        } catch (Exception e) {
//            log.error("Failed to send OTP: {}", e.getMessage());
//            //throw new RuntimeException("Failed to send verification code");
//            throw new BusinessException(
//                    "Failed to send verification code",
//                    ErrorCode.OTP_SEND_FAILED.getCode(),
//                    HttpStatus.SC_INTERNAL_SERVER_ERROR
//            );
//        }
//
//        // Store registration data temporarily (in production, use Redis)
//        // For now, return session ID
//        return Map.of("message", "OTP sent successfully",
//                      "identifier", identifier,
//                      "tempId", UUID.randomUUID().toString());
//    }

    @Override
    @Transactional
    public Map<String, String> initiateRegistration(RegisterRequest request) {
        log.info("=== INITIATE REGISTRATION CALLED ===");
        log.info("Phone: {}, Email: {}, Role: {}", request.getPhone(), request.getEmail(), request.getRole());

        // Check if user already exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BusinessException(
                    "Phone number already registered",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(),
                    HttpStatus.SC_CONFLICT
            );
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(
                    "Email already registered",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(),
                    HttpStatus.SC_CONFLICT
            );
        }

        // Determine identifier and channel based on role
        String identifier;
        String channel;
        String role = request.getRole() != null ? request.getRole().toLowerCase() : "seeker";

        if ("seeker".equals(role)) {
            identifier = request.getPhone();
            channel = "SMS";
        } else if ("company".equals(role)) {
            identifier = request.getEmail();
            channel = "EMAIL";
        } else {
            identifier = request.getPhone();
            channel = "SMS";
        }

        log.info("Sending OTP - Identifier: {}, Channel: {}, Role: {}", identifier, channel, role);

        try {
            // Add timeout and retry
//            String otpServiceResponse = webClientBuilder.build()
            webClientBuilder.build()
                    .post()
                    .uri(otpServiceUrl + "/api/v1/otp/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "identifier", identifier,
                            "channel", channel,
                            "purpose", "REGISTRATION"
                    ))
                    .retrieve()
                    .bodyToMono(String.class)
//                    .timeout(Duration.ofSeconds(60))
//                    .block();
                    .subscribe(  // NON-BLOCKING - returns immediately
                            response -> log.info("OTP sent successfully to: {}", identifier),
                            error -> log.error("Failed to send OTP: {}", error.getMessage())
                    );

//            log.info("OTP service response: {}", otpServiceResponse);
            log.info("OTP sent successfully to: {}", identifier);

        } catch (TimeoutException e) {
            log.error("OTP service timeout for: {}", identifier, e);
            // Don't throw error - OTP might still be sending
            // Return success anyway since OTP was generated
            log.warn("OTP service timed out, but OTP may have been sent");
        } catch (Exception e) {
            log.error("Failed to send OTP: {}", e.getMessage(), e);
            throw new BusinessException(
                    "Failed to send verification code. Please try again.",
                    ErrorCode.OTP_SEND_FAILED.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }

        // Store registration data temporarily
        try {
            // Add small delay to ensure OTP processing has started
            Thread.sleep(5000); // 5000ms delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Store registration data temporarily
        return Map.of(
                "message", "OTP sent successfully",
                "identifier", identifier,
                "tempId", UUID.randomUUID().toString()
        );
    }

    @Override
    @Transactional
    public Map<String, String> verifyOtpAndRegister(String identifier, String otpCode, RegisterRequest request) {
        // Verify OTP
        try {
            ApiResponse<Map<String, Boolean>> apiResponse = webClientBuilder.build()
                    .post()
                    .uri(otpServiceUrl + "/api/v1/otp/verify")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "identifier", identifier,
                            "code", otpCode,
                            "purpose", "REGISTRATION"
                    ))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<Map<String, Boolean>>>() {})
                    .block();

            if (apiResponse == null || !apiResponse.isSuccess()) {
                String errorMessage = apiResponse != null && apiResponse.getMessage() != null
                        ? apiResponse.getMessage()
                        : "OTP verification failed";
                throw new BusinessException(
                        errorMessage,
                        ErrorCode.INVALID_INPUT.getCode(),
                        HttpStatus.SC_BAD_REQUEST);
            }


            Map<String, Boolean> data = apiResponse.getData();
            boolean isValid = data != null && Boolean.TRUE.equals(data.get("verified"));
            if (!isValid) {
                throw new BusinessException(
                        "Invalid or expired OTP",
                        ErrorCode.INVALID_INPUT.getCode(),
                        HttpStatus.SC_BAD_REQUEST
                );
            }
        } catch (BusinessException e) {
            throw e; // Re-throw business exceptions
        } catch (Exception e) {
            log.error("OTP verification failed: {}", e.getMessage());
            //throw new RuntimeException("OTP verification failed");
            throw new BusinessException(
                    "OTP verification failed",
                    ErrorCode.OTP_VERIFICATION_FAILED.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }

        // Create user in auth DB
        User.Role role = "seeker".equals(request.getRole()) ? User.Role.SEEKER : User.Role.COMPANY;

        User user = User.builder()
                .phone(request.getPhone())
                .name(role == User.Role.SEEKER ? request.getFullName() : request.getCompanyName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Create profile in user service
        try {
            if (role == User.Role.SEEKER) {
                webClientBuilder.build()
                        .post()
                        .uri(userServiceUrl + "/api/v1/seeker/profiles/internal?userId={userId}", user.getId().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(Map.of(
                                //"userId", user.getId().toString(),
                                "fullName", request.getFullName(),
                                //"email", request.getEmail(),
                                "phone", request.getPhone()
                        ))
                        .retrieve()
                        .bodyToMono(Void.class)
                        .block();
            } else {
                webClientBuilder.build()
                        .post()
                        .uri(userServiceUrl + "/api/v1/company/profiles/internal?userId={userId}", user.getId().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(Map.of(
                                //"userId", user.getId().toString(),
                                "companyName", request.getCompanyName(),
                                "contactPerson", request.getContactPerson(),
                                "designation", request.getDesignation(),
                                "email", request.getEmail(),
                                "phone", request.getPhone()
                        ))
                        .retrieve()
                        .bodyToMono(Void.class)
                        .block();
            }
        } catch (Exception e) {
            log.error("Failed to create profile: {}", e.getMessage());
            // Don't fail registration, just log error
        }

        // Send welcome notification
        try {
            webClientBuilder.build()
                    .post()
                    .uri(notificationServiceUrl + "/api/v1/notifications/welcome")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "userId", user.getId().toString(),
                            "role", role.toString()
                    ))
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (Exception e) {
            log.error("Failed to send welcome notification: {}", e.getMessage());
        }

        return Map.of("message", "Registration successful");
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                //.orElseThrow(() -> new RuntimeException("Invalid credentials"));
                .orElseThrow(() -> new BusinessException(
                        "Invalid credentials",
                        ErrorCode.INVALID_CREDENTIALS.getCode(),
                        HttpStatus.SC_BAD_REQUEST
                ));

//        System.out.println("User: " + user);
//        System.out.println("Password: " + request.getPassword());
//        System.out.println("Email: " + user.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(
                    "Invalid credentials",
                    ErrorCode.INVALID_CREDENTIALS.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        if (!user.getIsActive()) {
            throw new BusinessException(
                    "Account is deactivated. Please contact support.",
                    ErrorCode.ACCOUNT_DISABLED.getCode(),
                    HttpStatus.SC_FORBIDDEN
            );
        }

        String accessToken = jwtUtil.generateToken(
                user.getId().toString(),
                user.getEmail() != null ? user.getEmail() : user.getPhone(),
                user.getRole().toString()
        );

        String refreshToken = refreshTokenService.createRefreshToken(user);

        String avatar = getPresignedUrlFromFileService(user.getId().toString());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400000L)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId().toString())
                        .avatar(avatar)
                        .name(user.getName())
                        .phone(user.getPhone())
                        .email(user.getEmail())
                        .role(user.getRole().toString())
                        .isProfileComplete(user.getIsProfileComplete())
                        .build())
                .build();
    }

    @Override
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                //.orElseThrow(() -> new RuntimeException("User not found"));
                .orElseThrow(() -> new BusinessException(
                        "User not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        String avatar = getPresignedUrlFromFileService(user.getId().toString());

        return UserResponse.builder()
                    .id(user.getId().toString())
                    .name(user.getName())
                    .avatar(avatar)
                    .phone(user.getPhone())
                    .email(user.getEmail())
                    .role(user.getRole().toString())
                    .isProfileComplete(user.getIsProfileComplete())
                    .build();
    }

    private String getPresignedUrlFromFileService(String userId) {
        try {
//            Map<String, String> requestBody = Map.of("fileKey", fileKey);

//            ApiResponse<String> response = webClientBuilder.build()
//                    .post()
//                    .uri(fileServiceUrl + "/api/v1/files/internal/presigned-url")
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .bodyValue(requestBody)
//                    .retrieve()
//                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<String>>() {})
//                    .block();

            ApiResponse<String> response = webClientBuilder.build()
                    .get()
                    .uri(fileServiceUrl + "/api/v1/files/internal/presigned-url/profile-pics/" + userId)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<String>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }

            log.error("Failed to get presigned URL: {}", response != null ? response.getMessage() : "Unknown error");
            return null;
        } catch (Exception e) {
            log.error("Failed to get presigned URL", e);
            return null;
        }
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        String userId = refreshTokenService.validateAndGetUserId(refreshToken);
        User user = userRepository.findById(UUID.fromString(userId))
                //.orElseThrow(() -> new RuntimeException("User not found"));
                .orElseThrow(() -> new BusinessException(
                        "User not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        String newAccessToken = jwtUtil.generateToken(
                user.getId().toString(),
                user.getEmail() != null ? user.getEmail() : user.getPhone(),
                user.getRole().toString()
        );

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400000L)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId().toString())
                        .phone(user.getPhone())
                        .email(user.getEmail())
                        .role(user.getRole().toString())
                        .build())
                .build();
    }

    @Override
    @Transactional
    public void logout(String userId, String refreshToken) {
        User user = userRepository.findById(UUID.fromString(userId))
                //.orElseThrow(() -> new RuntimeException("User not found"));
                .orElseThrow(() -> new BusinessException(
                        "User not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));
        refreshTokenService.revokeRefreshToken(user);
    }

    @Override
    public void updateName(String userId, String name) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new BusinessException(
                        "User not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        user.setName(name);

        userRepository.save(user);
    }

    @Override
    public void updateIsProfileComplete(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new BusinessException(
                        "User not found",
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        user.setIsProfileComplete(true);

        userRepository.save(user);
    }

}