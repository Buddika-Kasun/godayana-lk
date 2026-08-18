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
public class CourseEnrollmentSeekerResponse {
    private UUID id;
    private UUID courseId;
    private String courseTitle;
    private String location;
    private String companyName;
    private String logoUrl;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime savedAt;
}