package com.godayana.otp.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.otp.dto.SendOtpRequest;
import com.godayana.otp.dto.VerifyOtpRequest;
import com.godayana.otp.service.EsmsService;
import com.godayana.otp.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;
    private final EsmsService esmsService;

    @PostMapping("/send")
    public ApiResponse<Map<String, String>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        otpService.sendOtp(request);
        return ApiResponse.success(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify")
    public ApiResponse<Map<String, Boolean>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.verifyOtp(request);
        return ApiResponse.success(Map.of("verified", isValid));
    }

    // Add to your controller
    @GetMapping("/esms/test")
    public String testEsms() {
        return esmsService.getServiceStatus();
    }

    @GetMapping("/esms/test-credentials")
    public ApiResponse<Map<String, Object>> testEsmsCredentials() {
        Map<String, Object> result = esmsService.testCredentials();
        return ApiResponse.success(result);
    }
}