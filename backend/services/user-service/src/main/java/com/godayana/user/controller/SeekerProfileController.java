package com.godayana.user.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.dto.seeker.SeekerDetailsResponse;
import com.godayana.user.dto.request.SeekerProfileRequest;
import com.godayana.user.dto.response.*;
import com.godayana.user.service.SeekerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/seeker/profiles")
@RequiredArgsConstructor
public class SeekerProfileController {

    private final SeekerProfileService seekerProfileService;

    @GetMapping("/me")
    public ApiResponse<SeekerProfileResponse> getMyProfile(@RequestHeader("X-User-Id") String userId) {
        return ApiResponse.success(seekerProfileService.getProfileByUserId(UUID.fromString(userId)));
    }

    @PutMapping("/me")
    public ApiResponse<SeekerProfileResponse> updateMyProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody SeekerProfileRequest request) {
        return ApiResponse.success(seekerProfileService.updateProfile(UUID.fromString(userId), request));
    }

    @PatchMapping("/me/share-cv")
    public ApiResponse<Void> updateShareCvStatus(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam Boolean shareCv) {
        seekerProfileService.updateShareCvStatus(UUID.fromString(userId), shareCv);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> deleteMyProfile(@RequestHeader("X-User-Id") String userId) {
        seekerProfileService.deleteProfile(UUID.fromString(userId));
        return ApiResponse.success(null);
    }

    // Profile Picture Upload
    @PostMapping("/me/profile-pic")
    public ApiResponse<SeekerProfileResponse> uploadProfilePic(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(seekerProfileService.uploadProfilePic(UUID.fromString(userId), file));
    }

    // Resume Upload
    @PostMapping("/me/resume")
    public ApiResponse<SeekerProfileResponse> uploadResume(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(seekerProfileService.uploadResume(UUID.fromString(userId), file));
    }

    @GetMapping("/company/application/{seekerId}")
    public ApiResponse<SeekerProfileResponse> getCompanySeekerProfile(
            @PathVariable UUID seekerId,
            @RequestParam String applicationId
    ) {
        return ApiResponse.success(seekerProfileService.getProfileByUserIdAndApplicationId(seekerId, applicationId));
    }

    @GetMapping("/admin/approved/counts")
    public ApiResponse<ApprovedCountResponse> getSeekerApprovedCounts() {
        return ApiResponse.success(seekerProfileService.getSeekerApprovedCounts());
    }

    @GetMapping("/admin/status")
    public ApiResponse<Page<AdminSeekerProfileResponse>> getSeekersByStatus(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ApiResponse.success(seekerProfileService.getSeekersByStatus(status, pageable));
    }

    @GetMapping("/admin/search")
    public ApiResponse<Page<AdminSeekerProfileResponse>> searchSeekers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String educationLevel,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String dateRange,
            Pageable pageable) {
        return ApiResponse.success(seekerProfileService.searchSeekers(
                search, status, location, isActive, gender, educationLevel, experience, dateRange, pageable));
    }

    @GetMapping("/admin/{seekerId}")
    public ApiResponse<SeekerProfileResponse> getAdminSeekerProfile(@PathVariable UUID seekerId) {
        return ApiResponse.success(seekerProfileService.getProfileByUserId(seekerId));
    }

    @PostMapping("/admin/{seekerId}/active")
    public ApiResponse<Void> activeSeeker(@PathVariable UUID seekerId) {
        seekerProfileService.activeSeeker(seekerId);
        return ApiResponse.success(null);
    }

    @PostMapping("/admin/{seekerId}/suspend")
    public ApiResponse<Void> suspendSeeker(@PathVariable UUID seekerId) {
        seekerProfileService.suspendSeeker(seekerId);
        return ApiResponse.success(null);
    }

    // Internal endpoints for auth service
    @PostMapping("/internal")
    public ApiResponse<SeekerProfileResponse> createProfileInternal(
            @RequestParam UUID userId,
            @Valid @RequestBody SeekerProfileRequest request) {
        return ApiResponse.success(seekerProfileService.createProfile(userId, request));
    }

    @PostMapping("/internal/batch")
    public ApiResponse<Map<UUID, SeekerDetailsResponse>> getSeekerProfileBatch(@RequestBody List<UUID> seekerIds) {
        return ApiResponse.success(seekerProfileService.getInternalProfileByUserIds(seekerIds));
    }
}