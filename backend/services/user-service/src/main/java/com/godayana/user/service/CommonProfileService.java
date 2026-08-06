package com.godayana.user.service;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.UserNameAvatar;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.user.dto.response.CompanyCountResponse;
import com.godayana.user.dto.response.UserCountResponse;
import com.godayana.user.entity.CompanyProfile;
import com.godayana.user.entity.SeekerProfile;
import com.godayana.user.repository.CompanyProfileRepository;
import com.godayana.user.repository.SeekerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommonProfileService {

    private final SeekerProfileRepository seekerProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${FILE_SERVICE_URL}")
    private String fileServiceUrl;

    @Transactional(readOnly = true)
    public UserNameAvatar getUserNameAvatar(UUID userId) {
        log.debug("Fetching user profile for user: {}", userId);

        String name = null;
        String avatar = null;
        UUID id = null;

        // First, try to find as Seeker
        Optional<SeekerProfile> seekerProfileOpt = seekerProfileRepository.findByUserId(userId);
        if (seekerProfileOpt.isPresent()) {
            SeekerProfile seekerProfile = seekerProfileOpt.get();
            id = seekerProfile.getId();
            name = seekerProfile.getFullName();
            // If there's a display name, use that instead
            if (seekerProfile.getFullName() != null && !seekerProfile.getFullName().isEmpty()) {
                name = seekerProfile.getFullName();
            }
            if (seekerProfile.getProfilePicUrl() != null && !seekerProfile.getProfilePicUrl().isEmpty()) {
                avatar = getPresignedUrlFromFileService(seekerProfile.getProfilePicUrl());
            }

            log.debug("Found Seeker profile for user: {}, name: {}", userId, name);
            return UserNameAvatar.builder()
                    .id(id)
                    .name(name)
                    .avatarUrl(avatar)
                    .build();
        }

        // If not found as Seeker, try to find as Company
        Optional<CompanyProfile> companyProfileOpt = companyProfileRepository.findByUserId(userId);
        if (companyProfileOpt.isPresent()) {
            CompanyProfile companyProfile = companyProfileOpt.get();
            id = companyProfile.getId();
            name = companyProfile.getCompanyName();
            if (companyProfile.getLogoUrl() != null && !companyProfile.getLogoUrl().isEmpty()) {
                avatar = getPresignedUrlFromFileService(companyProfile.getLogoUrl());
            }

            log.debug("Found Company profile for user: {}, name: {}", userId, name);
            return UserNameAvatar.builder()
                    .id(id)
                    .name(name)
                    .avatarUrl(avatar)
                    .build();
        }

        // If user not found in either profile
        log.warn("User profile not found for user: {}", userId);
        throw new BusinessException(
                "User profile not found for user: " + userId,
                ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                HttpStatus.SC_NOT_FOUND
        );
    }

    @Transactional(readOnly = true)
    public Optional<UserNameAvatar> getUserNameAvatarOptional(UUID userId) {
        try {
            return Optional.of(getUserNameAvatar(userId));
        } catch (BusinessException e) {
            log.warn("User profile not found for user: {}, returning empty", userId);
            return Optional.empty();
        }
    }

    @Transactional(readOnly = true)
    public String getUserName(UUID userId) {
        try {
            return getUserNameAvatar(userId).getName();
        } catch (BusinessException e) {
            log.warn("User name not found for user: {}", userId);
            return "Unknown User";
        }
    }

    @Transactional(readOnly = true)
    public String getUserAvatar(UUID userId) {
        try {
            return getUserNameAvatar(userId).getAvatarUrl();
        } catch (BusinessException e) {
            log.warn("User avatar not found for user: {}", userId);
            return null;
        }
    }

    @Transactional(readOnly = true)
    public UserCountResponse getCounts() {
        log.debug("Getting user counts");

        long seekers = seekerProfileRepository.countByStatus(SeekerProfile.ProfileStatus.APPROVED);
        long companies = companyProfileRepository.countByStatus(CompanyProfile.CompanyStatus.APPROVED);

        return UserCountResponse.builder()
                .seekers(seekers)
                .companies(companies)
                .build();
    }


    private String getPresignedUrlFromFileService(String fileKey) {
        if (fileKey == null || fileKey.isEmpty()) {
            return null;
        }

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
            log.error("Failed to get presigned URL for fileKey: {}", fileKey, e);
            return null;
        }
    }
}