package com.godayana.user.service;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.ApiResponseWrapper;
import com.godayana.dto.FileUploadResponse;
import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.user.dto.request.CompanyProfileRequest;
import com.godayana.user.dto.response.AdminCompanyProfileResponse;
import com.godayana.user.dto.response.ApprovedCountResponse;
import com.godayana.user.dto.response.CompanyCountResponse;
import com.godayana.user.dto.response.CompanyProfileResponse;
import com.godayana.user.entity.CompanyProfile;
import com.godayana.user.entity.SeekerProfile;
import com.godayana.user.repository.CompanyProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyProfileService {

    private final CompanyProfileRepository companyProfileRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${FILE_SERVICE_URL}")
    private String fileServiceUrl;

    @Value("${AUTH_SERVICE_URL}")
    private String authServiceUrl;

    @Transactional
    public CompanyProfileResponse createProfile(UUID userId, CompanyProfileRequest request) {
        log.info("Creating company profile for user: {}", userId);

        if (companyProfileRepository.existsByUserId(userId)) {
            throw new BusinessException(
                    "Profile already exists for this user",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(),
                    HttpStatus.SC_CONFLICT
            );
        }

        CompanyProfile profile = CompanyProfile.builder()
                .userId(userId)
                .companyName(request.getCompanyName())
                .registrationNumber(request.getRegistrationNumber())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .companyType(request.getCompanyType())
                .employeeCount(request.getEmployeeCount())
                .location(request.getLocation())
                .companyEmail(request.getCompanyEmail())
                .hotlineNumber(request.getHotlineNumber())
                .facebookUrl(request.getFacebookUrl())
                .linkedinUrl(request.getLinkedinUrl())
                .instagramUrl(request.getInstagramUrl())
                .contactPersonName(request.getContactPersonName())
                .designation(request.getDesignation())
                .cvDeliveryEmail(request.getCvDeliveryEmail())
                .isVerified(false)
                .jobPostingTerms(false)
                .cvDeliveryTerms(false)
                .status(CompanyProfile.CompanyStatus.PENDING)
                .build();

        profile = companyProfileRepository.save(profile);
        log.info("Company profile created successfully with id: {}, status: PENDING", profile.getId());

        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public CompanyProfileResponse getProfileByUserId(UUID userId) {
        log.debug("Fetching company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        return mapToResponse(profile);
    }

    public CompanyDetailsResponse getInternalProfileByUserId(UUID userId) {
        log.debug("Fetching company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        String logoUrl = getPresignedUrlFromFileService(profile.getLogoUrl());

        return CompanyDetailsResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .description(profile.getDescription())
                .employeeCount(profile.getEmployeeCount())
                .industry(profile.getIndustry())
                .companyType(profile.getCompanyType())
                .location(profile.getLocation())
                .logoUrl(logoUrl)
                .website(profile.getWebsite())
                .build();

    }

    @Transactional(readOnly = true)
    public Map<UUID, CompanyDetailsResponse> getInternalProfileByUserIds(List<UUID> userIds) {
        log.debug("Fetching company profiles for {} users", userIds != null ? userIds.size() : 0);

        if (userIds == null || userIds.isEmpty()) {
            return new HashMap<>();
        }

        // Remove duplicates
        List<UUID> uniqueUserIds = userIds.stream()
                .distinct()
                .collect(Collectors.toList());

        // Fetch all profiles in one query
        List<CompanyProfile> profiles = companyProfileRepository.findAllByUserIdIn(uniqueUserIds);

        // Batch fetch presigned URLs for all logo keys
        List<String> fileKeys = profiles.stream()
                .map(CompanyProfile::getLogoUrl)
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        // Get all presigned URLs in one batch
        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        // Map to response
        return profiles.stream()
                .map(profile -> mapToCompanyDetails(profile, presignedUrlMap))
                .collect(Collectors.toMap(
                        CompanyDetailsResponse::getUserId,
                        details -> details
                ));

    }

    @Transactional(readOnly = true)
    public CompanyCountResponse getCompanyCounts() {
        log.debug("Getting company counts");

        long total = companyProfileRepository.countAll();
        long pending = companyProfileRepository.countByStatus(CompanyProfile.CompanyStatus.PENDING);
        long approved = companyProfileRepository.countByStatus(CompanyProfile.CompanyStatus.APPROVED);
        long rejected = companyProfileRepository.countByStatus(CompanyProfile.CompanyStatus.REJECTED);

        return CompanyCountResponse.builder()
                .all(total)
                .pending(pending)
                .approved(approved)
                .rejected(rejected)
                .build();
    }

    @Transactional(readOnly = true)
    public ApprovedCountResponse getCompanyApprovedCounts() {
        log.debug("Getting company approved counts");

        long total = companyProfileRepository.countByStatus(CompanyProfile.CompanyStatus.APPROVED);
        long active = companyProfileRepository.countApprovedByActivation(true);
        long suspended = companyProfileRepository.countApprovedByActivation(false);

        return ApprovedCountResponse.builder()
                .all(total)
                .active(active)
                .suspended(suspended)
                .build();
    }

    @Transactional(readOnly = true)
    public Page<AdminCompanyProfileResponse> searchCompanies(
            String search,
            String status,
            String industry,
            Boolean isVerified,
            Boolean activeJobs,
            String dateRange,
            Pageable pageable
    ) {
        log.debug("Searching companies with filters - search: {}, status: {}, industry: {}, isVerified: {}, dateRange: {}, activeJobs: {}",
                search, status, industry, isVerified, dateRange, activeJobs);

        // Parse date range
        LocalDateTime createdAfter = null;
        LocalDateTime createdBefore = null;


        // Convert string to enum
        CompanyProfile.CompanyStatus companyStatus = CompanyProfile.CompanyStatus.valueOf(status.toUpperCase());

        if (dateRange != null && !dateRange.equalsIgnoreCase("all") && !dateRange.isEmpty()) {
            switch (dateRange.toLowerCase()) {
                case "7":
                    createdAfter = LocalDateTime.now().minusDays(7);
                    break;
                case "30":
                    createdAfter = LocalDateTime.now().minusDays(30);
                    break;
                case "90":
                    createdAfter = LocalDateTime.now().minusDays(90);
                    break;
                case "year":
                    createdAfter = LocalDateTime.now().minusDays(365);
                    break;
                default:
                    // Try to parse as custom date range
                    String[] parts = dateRange.split(",");
                    if (parts.length == 2) {
                        try {
                            createdAfter = LocalDateTime.parse(parts[0] + "T00:00:00");
                            createdBefore = LocalDateTime.parse(parts[1] + "T23:59:59");
                        } catch (Exception e) {
                            log.warn("Invalid date range format: {}", dateRange);
                        }
                    }
                    break;
            }
        }

        try {
            // Fetch companies from database
            Page<CompanyProfile> companyPage = companyProfileRepository.searchCompaniesNative(
                    search,
                    status,
                    industry,
                    isVerified,
                    createdAfter,
                    createdBefore,
                    pageable
            );

            // Extract all logo file keys from the results
            List<String> logoKeys = companyPage.getContent().stream()
                    .map(CompanyProfile::getLogoUrl)
                    .filter(key -> key != null && !key.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

            // Batch fetch presigned URLs for all logos
            Map<String, String> presignedUrlMap = getPresignedUrlsBatch(logoKeys);

            // Map to response with batch presigned URLs
            return companyPage.map(profile -> mapToAdminResponse(profile, presignedUrlMap));

        } catch (IllegalArgumentException e) {
            log.warn("Invalid status value: {}", status);
            throw new BusinessException(
                    "Invalid status: " + status + ". Valid values: PENDING, APPROVED, REJECTED, SUSPENDED",
                    ErrorCode.INVALID_INPUT.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }
    }

    @Transactional(readOnly = true)
    public Page<AdminCompanyProfileResponse> getCompaniesByStatus(String status, Pageable pageable) {
        log.debug("Fetching companies with status: {}", status);

        // If no status provided, return all companies
        if (status == null || status.isEmpty()) {
            Page<CompanyProfile> companyPage = companyProfileRepository.findAll(pageable);

            // Batch fetch logos
            List<String> logoKeys = companyPage.getContent().stream()
                    .map(CompanyProfile::getLogoUrl)
                    .filter(key -> key != null && !key.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

            Map<String, String> presignedUrlMap = getPresignedUrlsBatch(logoKeys);

            return companyPage.map(profile -> mapToAdminResponse(profile, presignedUrlMap));
        }

        try {
            // Convert string to enum
            CompanyProfile.CompanyStatus companyStatus = CompanyProfile.CompanyStatus.valueOf(status.toUpperCase());

            // Use the dynamic status parameter
            Page<CompanyProfile> companyPage = companyProfileRepository.findByStatus(companyStatus, pageable);

            // Batch fetch logos
            List<String> logoKeys = companyPage.getContent().stream()
                    .map(CompanyProfile::getLogoUrl)
                    .filter(key -> key != null && !key.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

            Map<String, String> presignedUrlMap = getPresignedUrlsBatch(logoKeys);

            return companyPage.map(profile -> mapToAdminResponse(profile, presignedUrlMap));

        } catch (IllegalArgumentException e) {
            log.warn("Invalid status value: {}", status);
            throw new BusinessException(
                    "Invalid status: " + status + ". Valid values: PENDING, APPROVED, REJECTED, SUSPENDED",
                    ErrorCode.INVALID_INPUT.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }
    }


    @Transactional(readOnly = true)
    public List<CompanyProfileResponse> getUnverifiedCompanies() {
        log.debug("Fetching unverified companies");

        return companyProfileRepository.findByIsVerifiedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CompanyProfileResponse updateProfile(UUID userId, CompanyProfileRequest request) {
        log.info("Updating company profile for user: {}", userId);

        // Try to find existing profile
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElse(null);

        // If profile doesn't exist, create a new one
        if (profile == null) {
            log.info("Profile not found for user: {}, creating new profile", userId);

            authNameUpdate(userId.toString(), request.getCompanyName());

            return createProfile(userId, request);
        }

        // Update fields
        if (request.getCompanyName() != null) profile.setCompanyName(request.getCompanyName());
        if (request.getRegistrationNumber() != null) profile.setRegistrationNumber(request.getRegistrationNumber());
        if (request.getWebsite() != null) profile.setWebsite(request.getWebsite());
//        if (request.getLogoUrl() != null) profile.setLogoUrl(request.getLogoUrl());
        if (request.getDescription() != null) profile.setDescription(request.getDescription());
        if (request.getIndustry() != null) profile.setIndustry(request.getIndustry());
        if (request.getCompanyType() != null) profile.setCompanyType(request.getCompanyType());
        if (request.getEmployeeCount() != null) profile.setEmployeeCount(request.getEmployeeCount());
        if (request.getLocation() != null) profile.setLocation(request.getLocation());
        if (request.getCompanyEmail() != null) profile.setCompanyEmail(request.getCompanyEmail());
        if (request.getHotlineNumber() != null) profile.setHotlineNumber(request.getHotlineNumber());
        if (request.getFacebookUrl() != null) profile.setFacebookUrl(request.getFacebookUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getInstagramUrl() != null) profile.setInstagramUrl(request.getInstagramUrl());
        if (request.getContactPersonName() != null) profile.setContactPersonName(request.getContactPersonName());
        if (request.getDesignation() != null) profile.setDesignation(request.getDesignation());
        if (request.getCvDeliveryEmail() != null) profile.setCvDeliveryEmail(request.getCvDeliveryEmail());
        if (request.getJobPostingTerms() != null) profile.setJobPostingTerms(request.getJobPostingTerms());
        if (request.getCvDeliveryTerms() != null) profile.setCvDeliveryTerms(request.getCvDeliveryTerms());

        profile = companyProfileRepository.save(profile);

//        webClientBuilder.build()
//                .post()
//                .uri(authServiceUrl + "/api/v1/auth/internal/update-name/" + userId + "?name=" + URLEncoder.encode(profile.getCompanyName(), StandardCharsets.UTF_8))
//                .contentType(MediaType.APPLICATION_JSON)
//                .retrieve()
//                .bodyToMono(Void.class)
//                .block();
        authNameUpdate(userId.toString(), profile.getCompanyName());

        log.info("Company profile updated successfully for user: {}", userId);

        return mapToResponse(profile);
    }

    private void authNameUpdate(String userId, String name) {
        webClientBuilder.build()
                .post()
                .uri(authServiceUrl + "/api/v1/auth/internal/update-name/" + userId + "?name=" + URLEncoder.encode(name, StandardCharsets.UTF_8))
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    @Transactional
    public void approveCompany(UUID userId) {
        log.info("Approving company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        profile.setStatus(CompanyProfile.CompanyStatus.APPROVED);
        profile.setIsVerified(true);
        profile = companyProfileRepository.save(profile);

        log.info("Company profile approved for user: {}", userId);
//        return mapToAdminResponse(profile);
//        return "Approved";
    }

    @Transactional
    public void rejectCompany(UUID userId) {
        log.info("Approving company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        profile.setStatus(CompanyProfile.CompanyStatus.REJECTED);
//        profile.setIsVerified(false);
        profile = companyProfileRepository.save(profile);

        log.info("Company profile reject for user: {}", userId);
//        return mapToAdminResponse(profile);
//        return "Rejected";
    }

    @Transactional
    public void activeCompany(UUID userId) {
        log.info("Activating company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        if (profile.getStatus() != CompanyProfile.CompanyStatus.APPROVED) {
            throw new BusinessException(
                    "Only approved accounts can be activated. Current status: " + profile.getStatus(),
                    ErrorCode.INVALID_STATUS_TRANSITION.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        profile.setIsVerified(true);
        profile = companyProfileRepository.save(profile);

        log.info("Company profile activated for user: {}", userId);
//        return mapToResponse(profile);
    }

    @Transactional
    public void suspendCompany(UUID userId) {
        log.info("Suspending company profile for user: {}", userId);

        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        if (profile.getStatus() != CompanyProfile.CompanyStatus.APPROVED) {
            throw new BusinessException(
                    "Only approved accounts can be activated. Current status: " + profile.getStatus(),
                    ErrorCode.INVALID_STATUS_TRANSITION.getCode(),
                    HttpStatus.SC_BAD_REQUEST
            );
        }

        profile.setIsVerified(false);
        profile = companyProfileRepository.save(profile);

        log.info("Company profile suspended for user: {}", userId);
//        return mapToResponse(profile);
    }

    @Transactional
    public void deleteProfile(UUID userId) {
        log.info("Deleting company profile for user: {}", userId);
        companyProfileRepository.deleteByUserId(userId);
    }

    private CompanyProfileResponse mapToResponse(CompanyProfile profile) {
        String logoUrl = getPresignedUrlFromFileService(profile.getLogoUrl());

        return CompanyProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .registrationNumber(profile.getRegistrationNumber())
                .website(profile.getWebsite())
                .logoUrl(logoUrl)
                .description(profile.getDescription())
                .industry(profile.getIndustry())
                .companyType(profile.getCompanyType())
                .employeeCount(profile.getEmployeeCount())
                .location(profile.getLocation())
                .companyEmail(profile.getCompanyEmail())
                .hotlineNumber(profile.getHotlineNumber())
                .facebookUrl(profile.getFacebookUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .instagramUrl(profile.getInstagramUrl())
                .contactPersonName(profile.getContactPersonName())
                .designation(profile.getDesignation())
                .cvDeliveryEmail(profile.getCvDeliveryEmail())
                .isVerified(profile.getIsVerified())
                .cvDeliveryTerms(profile.getCvDeliveryTerms())
                .jobPostingTerms(profile.getJobPostingTerms())
                .status(profile.getStatus().toString())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    private AdminCompanyProfileResponse mapToAdminResponse(CompanyProfile profile, Map<String, String> presignedUrlMap) {
        // Get logo URL from map or fallback to single fetch
        String logoUrl = null;
        if (profile.getLogoUrl() != null && !profile.getLogoUrl().isEmpty()) {
            logoUrl = presignedUrlMap.getOrDefault(
                    profile.getLogoUrl(),
                    getPresignedUrlFromFileService(profile.getLogoUrl())
            );
        }

        return AdminCompanyProfileResponse.builder()
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .logoUrl(logoUrl)
                .industry(profile.getIndustry())
                .companyEmail(profile.getCompanyEmail())
                .hotlineNumber(profile.getHotlineNumber())
                .contactPersonName(profile.getContactPersonName())
                .designation(profile.getDesignation())
                .status(profile.getStatus().toString())
                .jobCount(0)
                .courseCount(0)
                .activation(profile.getIsVerified())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    private AdminCompanyProfileResponse mapToAdminResponse(CompanyProfile profile) {
        String logoUrl = getPresignedUrlFromFileService(profile.getLogoUrl());

        return AdminCompanyProfileResponse.builder()
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .logoUrl(logoUrl)
                .industry(profile.getIndustry())
                .companyEmail(profile.getCompanyEmail())
                .hotlineNumber(profile.getHotlineNumber())
                .contactPersonName(profile.getContactPersonName())
                .designation(profile.getDesignation())
                .status(profile.getStatus().toString())
                .jobCount(0)
                .courseCount(0)
                .activation(profile.getIsVerified())
                .createdAt(profile.getCreatedAt())
                .build();
    }


    private String getPresignedUrlFromFileService(String fileKey) {
        try {
            Map<String, String> requestBody = Map.of("fileKey", fileKey);

            ApiResponse<String> response = webClientBuilder.build()
                    .post()
                    .uri(fileServiceUrl + "/api/v1/files/internal/presigned-url")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
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

    private Map<String, String> getPresignedUrlsBatch(List<String> fileKeys) {
        Map<String, String> result = new HashMap<>();

        if (fileKeys == null || fileKeys.isEmpty()) {
            return result;
        }

        try {
            // Call file service batch endpoint
            ApiResponse<Map<String, String>> response = webClientBuilder.build()
                    .post()
                    .uri(fileServiceUrl + "/api/v1/files/internal/presigned-urls/batch")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(fileKeys)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<Map<String, String>>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                result.putAll(response.getData());
            } else {
                log.warn("Failed to get batch presigned URLs: {}", response != null ? response.getMessage() : "Unknown error");
            }
        } catch (Exception e) {
            log.error("Failed to get batch presigned URLs", e);
        }

        return result;
    }

    @Transactional
    public CompanyProfileResponse uploadProfileLogo(UUID userId, MultipartFile file) {
        log.info("Uploading profile picture for user: {}", userId);

        // Get profile
        CompanyProfile profile = companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        "Company profile not found for user: " + userId,
                        ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                        HttpStatus.SC_NOT_FOUND
                ));

        try {
            // Call file service to upload
            String fileKey = uploadProfilePicToFileService(file, "company-profile-pics", userId.toString());
            //log.info("Received file URL from file service: {}", fileKey); // Add this log

            // Update profile with new URL
            profile.setLogoUrl(fileKey);
            profile = companyProfileRepository.save(profile);

            //log.info("Profile picture updated successfully for user: {}", userId);
            return mapToResponse(profile);

        } catch (Exception e) {
            //log.error("Failed to upload profile picture for user: {}", userId, e);
            throw new BusinessException(
                    "Failed to upload profile picture: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private String uploadProfilePicToFileService(MultipartFile file, String folder, String userId) {
        try {
            // Create multipart body
            MultiValueMap<String, Object> multipartBody = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            multipartBody.add("file", resource);

            // Use INTERNAL endpoint - this doesn't require X-User-Id header
            String internalUrl = fileServiceUrl + "/api/v1/files/internal/upload/profile-pic?folder=" + folder + "&userId=" + userId;

            ApiResponseWrapper<FileUploadResponse> responseWrapper = webClientBuilder.build()
                    .post()
                    .uri(internalUrl)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(multipartBody))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponseWrapper<FileUploadResponse>>() {})
                    .block();

            if (responseWrapper == null) {
                log.error("Response from file service is null");
                throw new BusinessException(
                        "No response from file service",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            if (!responseWrapper.getSuccess()) {
                log.error("File service returned error: {}", responseWrapper.getMessage());
                throw new BusinessException(
                        "File service error: " + responseWrapper.getMessage(),
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            FileUploadResponse data = responseWrapper.getData();
            if (data == null) {
                log.error("File service response data is null");
                throw new BusinessException(
                        "No data in file service response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            String fileKey = data.getFileKey();
            log.info("File uploaded successfully. FileId: {}, FileUrl: {}",
                    data.getFileId(), fileKey);

            if (fileKey == null || fileKey.isEmpty()) {
                throw new BusinessException(
                        "File URL not found in response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            return fileKey;

        } catch (IOException e) {
            log.error("Failed to read file bytes", e);
            throw new BusinessException(
                    "Failed to read file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        } catch (Exception e) {
            log.error("Failed to upload file to file service", e);
            throw new BusinessException(
                    "Failed to upload file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private CompanyDetailsResponse mapToCompanyDetails(CompanyProfile profile, Map<String, String> presignedUrlMap) {
        // Get logo URL from map or fallback to single fetch
        String logoUrl = null;
//        if (profile.getLogoUrl() != null && !profile.getLogoUrl().isEmpty()) {
//            logoUrl = presignedUrlMap.getOrDefault(
//                    profile.getLogoUrl(),
//                    getPresignedUrlFromFileService(profile.getLogoUrl())
//            );
//        }
        if (profile.getLogoUrl() != null && !profile.getLogoUrl().isEmpty()) {
            // Try to get from the batch map first
            if (presignedUrlMap != null && presignedUrlMap.containsKey(profile.getLogoUrl())) {
                logoUrl = presignedUrlMap.get(profile.getLogoUrl());
            } else {
                // Fallback: fetch individually (should rarely happen)
                log.warn("Logo URL not found in batch map for profile: {}, fetching individually",
                        profile.getCompanyName());
                logoUrl = getPresignedUrlFromFileService(profile.getLogoUrl());
            }
        }

        return CompanyDetailsResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .description(profile.getDescription())
                .employeeCount(profile.getEmployeeCount())
                .industry(profile.getIndustry())
                .companyType(profile.getCompanyType())
                .location(profile.getLocation())
                .logoUrl(logoUrl)
                .website(profile.getWebsite())
                .build();
    }

}
