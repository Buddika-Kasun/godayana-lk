package com.godayana.user.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.user.dto.request.CompanyProfileRequest;
import com.godayana.user.dto.response.AdminCompanyProfileResponse;
import com.godayana.user.dto.response.ApprovedCountResponse;
import com.godayana.user.dto.response.CompanyCountResponse;
import com.godayana.user.dto.response.CompanyProfileResponse;
import com.godayana.user.service.CompanyProfileService;
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
@RequestMapping("/api/v1/company/profiles")
@RequiredArgsConstructor
public class CompanyProfileController {

    private final CompanyProfileService companyProfileService;

    @GetMapping("/me")
    public ApiResponse<CompanyProfileResponse> getMyProfile(@RequestHeader("X-User-Id") String userId) {
        return ApiResponse.success(companyProfileService.getProfileByUserId(UUID.fromString(userId)));
    }

    @PutMapping("/me")
    public ApiResponse<CompanyProfileResponse> updateMyProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(companyProfileService.updateProfile(UUID.fromString(userId), request));
    }

    @DeleteMapping("/me")
    public ApiResponse<Void> deleteMyProfile(@RequestHeader("X-User-Id") String userId) {
        companyProfileService.deleteProfile(UUID.fromString(userId));
        return ApiResponse.success(null);
    }

    // Profile Picture Upload
    @PostMapping("/me/logo")
    public ApiResponse<CompanyProfileResponse> uploadProfileLog(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(companyProfileService.uploadProfileLogo(UUID.fromString(userId), file));
    }

    // Admin endpoints
    @GetMapping("/admin/counts")
    public ApiResponse<CompanyCountResponse> getCompanyCounts() {
        return ApiResponse.success(companyProfileService.getCompanyCounts());
    }

    @GetMapping("/admin/approved/counts")
    public ApiResponse<ApprovedCountResponse> getCompanyApprovedCounts() {
        return ApiResponse.success(companyProfileService.getCompanyApprovedCounts());
    }

    @GetMapping("/admin/status")
    public ApiResponse<Page<AdminCompanyProfileResponse>> getCompaniesByStatus(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ApiResponse.success(companyProfileService.getCompaniesByStatus(status, pageable));
    }

    @GetMapping("/admin/search")
    public ApiResponse<Page<AdminCompanyProfileResponse>> searchCompanies(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) Boolean isVerified,
            @RequestParam(required = false) Boolean activeJobs,
            @RequestParam(required = false) String dateRange,
            Pageable pageable) {
        return ApiResponse.success(companyProfileService.searchCompanies(
                search, status, industry, isVerified, activeJobs, dateRange, pageable));
    }

    @GetMapping("/admin/{companyId}")
    public ApiResponse<CompanyProfileResponse> getAdminCompanyProfile(@PathVariable UUID companyId) {
        return ApiResponse.success(companyProfileService.getProfileByUserId(companyId));
    }

    @GetMapping("/admin/unverified")
    public ApiResponse<List<CompanyProfileResponse>> getUnverifiedCompanies() {
        return ApiResponse.success(companyProfileService.getUnverifiedCompanies());
    }

    @PostMapping("/admin/{companyId}/approve")
    public ApiResponse<Void> approveCompany(@PathVariable UUID companyId) {
        companyProfileService.approveCompany(companyId);
        return ApiResponse.success(null);
    }

    @PostMapping("/admin/{companyId}/reject")
    public ApiResponse<Void> rejectCompany(@PathVariable UUID companyId) {
        companyProfileService.rejectCompany(companyId);
        return ApiResponse.success(null);
    }

    @PostMapping("/admin/{companyId}/active")
    public ApiResponse<Void> activeCompany(@PathVariable UUID companyId) {
        companyProfileService.activeCompany(companyId);
        return ApiResponse.success(null);
    }

    @PostMapping("/admin/{companyId}/suspend")
    public ApiResponse<Void> suspendCompany(
            @PathVariable UUID companyId
    ) {
        companyProfileService.suspendCompany(companyId);
        return ApiResponse.success(null);
    }

    // Internal endpoints for auth service
    @PostMapping("/internal")
    public ApiResponse<CompanyProfileResponse> createProfileInternal(
            @RequestParam UUID userId,
            @Valid @RequestBody CompanyProfileRequest request) {
        return ApiResponse.success(companyProfileService.createProfile(userId, request));
    }

    @GetMapping("/internal/{companyId}")
    public ApiResponse<CompanyDetailsResponse> getCompanyProfile(@PathVariable UUID companyId) {
        return ApiResponse.success(companyProfileService.getInternalProfileByUserId(companyId));
    }

    @PostMapping("/internal/batch")
    public ApiResponse<Map<UUID, CompanyDetailsResponse>> getCompanyProfileBatch(@RequestBody List<UUID> companyIds) {
        return ApiResponse.success(companyProfileService.getInternalProfileByUserIds(companyIds));
    }
}