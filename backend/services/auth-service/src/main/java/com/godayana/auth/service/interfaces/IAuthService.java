package com.godayana.auth.service.interfaces;

import com.godayana.auth.dto.LoginRequest;
import com.godayana.auth.dto.LoginResponse;
import com.godayana.auth.dto.RegisterRequest;
import com.godayana.auth.dto.UserResponse;

import java.util.Map;

public interface IAuthService {
    Map<String, String> initiateRegistration(RegisterRequest request);
    Map<String, String> verifyOtpAndRegister(String identifier, String otpCode, RegisterRequest request);
    LoginResponse login(LoginRequest request);
    UserResponse getUserById(String userId);
    LoginResponse refreshToken(String refreshToken);
    void logout(String userId, String refreshToken);
    void updateName(String userId, String name);
    void updateIsProfileComplete(String userId);
}
