package com.godayana.course.dto;

import com.godayana.course.entity.CourseEnrollment;
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
public class CourseEnrollmentSummary {
    private UUID id;
    private UUID courseId;
    private UUID seekerId;
    private CourseEnrollment.EnrollmentStatus status;
    private LocalDateTime enrolledAt;
    private LocalDateTime savedAt;
    private String courseTitle;
    private String location;
    private UUID companyId;

    // Constructor for Job Applications
    public CourseEnrollmentSummary(UUID id, UUID courseId, UUID seekerId,
                                   CourseEnrollment.EnrollmentStatus status,
                                   LocalDateTime enrolledAt,
                                   String courseTitle, String location, UUID companyId) {
        this.id = id;
        this.courseId = courseId;
        this.seekerId = seekerId;
        this.status = status;
        this.enrolledAt = enrolledAt;
        this.courseTitle = courseTitle;
        this.location = location;
        this.companyId = companyId;
        this.savedAt = null;
    }

    // Constructor for Saved Jobs
    public CourseEnrollmentSummary(UUID courseId, UUID seekerId, String courseTitle,
                                   String location, UUID companyId,
                                   LocalDateTime savedAt,
                                   CourseEnrollment.EnrollmentStatus status) {
        this.courseId = courseId;
        this.seekerId = seekerId;
        this.courseTitle = courseTitle;
        this.location = location;
        this.companyId = companyId;
        this.savedAt = savedAt;
        this.status = status;
        this.id = null;
        this.enrolledAt = null;
    }
}