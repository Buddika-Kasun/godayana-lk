package com.godayana.user.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.UserNameAvatar;
import com.godayana.user.dto.response.CompanyCountResponse;
import com.godayana.user.dto.response.UserCountResponse;
import com.godayana.user.service.CommonProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/common/profiles")
@RequiredArgsConstructor

public class CommonProfileController {
    private final CommonProfileService commonProfileService;

    @GetMapping("/internal/name-avatar/{userId}")
    public ApiResponse<UserNameAvatar> getUserNameAvatar(@PathVariable String userId) {
        return ApiResponse.success(commonProfileService.getUserNameAvatar(UUID.fromString(userId)));
    }

    @GetMapping("/admin/counts")
    public ApiResponse<UserCountResponse> getUserCounts() {
        return ApiResponse.success(commonProfileService.getCounts());
    }
}
