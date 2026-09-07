package com.godayana.auth.controller;

import com.godayana.auth.dto.LoginRequest;
import com.godayana.auth.dto.LoginResponse;
import com.godayana.auth.dto.RegisterRequest;
import com.godayana.auth.dto.UserResponse;
import com.godayana.auth.service.AuthService;
import com.godayana.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/initiate")
    public ApiResponse<Map<String, String>> initiateRegistration(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.initiateRegistration(request));
    }

    @PostMapping("/register/verify")
    public ApiResponse<Map<String, String>> verifyAndRegister(
            @RequestParam String identifier,
            @RequestParam String otpCode,
            @Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.verifyOtpAndRegister(identifier, otpCode, request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> currentUser(@RequestHeader("X-User-Id") String userId) {
        return ApiResponse.success(authService.getUserById(userId));
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        String token = refreshToken.substring(7); // Remove "Bearer " prefix
        return ApiResponse.success(authService.refreshToken(token));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader("X-User-Id") String userId,
                                    @RequestHeader("Authorization") String refreshToken) {
        String token = refreshToken.substring(7);
        authService.logout(userId, token);
        return ApiResponse.success(null);
    }

    @PostMapping("/internal/update-name/{userId}")
    public ApiResponse<Void> updateName(
            @PathVariable("userId") String userId,
            @RequestParam("name") String name
    ) {
        authService.updateName(userId, name);
        return ApiResponse.success(null);
    }

    @PostMapping("/internal/update-profile-completion/{userId}")
    public ApiResponse<Void> updateIsProfileComplete(
            @PathVariable("userId") String userId
    ) {
        authService.updateIsProfileComplete(userId);
        return ApiResponse.success(null);
    }
}