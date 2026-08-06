package com.godayana.course.dto.response;

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
public class CourseEnrollmentCompanyResponse {
    private UUID id;
    private UUID seekerId;
    private String seekerName;
    private String seekerProfileUrl;
    private String seekerCvUrl;
    private String seekerEmail;
    private String seekerContactNo;
    private String seekerGender;
    private String seekerEducation;
    private String seekerStudyField;
    private String status;
    private LocalDateTime appliedAt;
}