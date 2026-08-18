package com.godayana.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeekerProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;

    private String profilePicUrl;
    private String resumeUrl;
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
}