package com.godayana.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeekerProfileResponse {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private String phone;
    private String profilePicUrl;
    private String resumeUrl;
    private String resumeFileKey;
    private String[] skills;
    private Integer experienceYears;
    private String education;
    private String studyField;
    private String location;
    private LocalDate dateOfBirth;
    private String gender;
    private String nationality;
    private String employmentStatus;
    private String currentJobTitle;
    private BigDecimal currentSalary;
    private BigDecimal expectedSalary;
    private String noticePeriod;
    private String portfolioUrl;
    private String professionalSummary;
    private String[] preferredJobCategories;
    private Boolean shareCv;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}