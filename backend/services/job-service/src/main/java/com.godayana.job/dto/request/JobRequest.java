package com.godayana.job.dto.request;

import com.godayana.job.entity.Job;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String category;
    private String location;

    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private Boolean salaryNegotiable;

    private String educationLevel;
    private String minExperience;

    @NotBlank(message = "Employment type is required")
    private String employmentType;

    private String fieldOfStudy;
    private Integer minAge;
    private Integer maxAge;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

//    private String workingHours;
    private LocalTime startTime;
    private LocalTime endTime;

    private String benefits;
    private LocalDateTime applicationDeadline;

    @NotBlank(message = "Confirmation email is required")
    private String confirmationEmail;

    @NotNull(message = "Job type is required")
    private String type;

    private List<String> skills;
    private String descriptionImageFileKey;

    @NotNull(message = "CV delivery option is required")
    private String cvDeliveryOption;

    private Job.MatchingCriteria matchingCriteria;

    private String status;
}