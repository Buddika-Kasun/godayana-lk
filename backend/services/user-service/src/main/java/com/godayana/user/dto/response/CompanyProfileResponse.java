package com.godayana.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileResponse {
    private UUID id;
    private UUID userId;
    private String companyName;
    private String registrationNumber;
    private String website;
    private String logoUrl;
    private String description;
    private String industry;
    private String companyType;
    private String employeeCount;
    private String location;
    private String companyEmail;
    private String hotlineNumber;
    private String facebookUrl;
    private String linkedinUrl;
    private String instagramUrl;
    private String contactPersonName;
    private String designation;
    private String cvDeliveryEmail;
    private Boolean isVerified;
    private Boolean isProfileComplete;
    private Boolean jobPostingTerms;
    private Boolean cvDeliveryTerms;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}