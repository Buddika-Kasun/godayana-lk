package com.godayana.course.dto.response;

import com.godayana.course.dto.Curriculum;
import com.godayana.dto.company.CompanyDetailsResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    // Basic Information
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String title;
    private String category;
    private String categoryLabel;
    private String description;
    private String enrollType; // online or physical
    private String location;

    private List<String> migrationPaths;
    private String requirementLevel;

    // Instructor Information
    private String instructor;
    private String instructorBio;
    private String instructorAvatar;

    // Schedule Information
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String duration;
    private String schedule;

    // Pricing & Capacity
    private BigDecimal price;
    private Integer maxStudents;
    private Integer enrolledStudents;

    // Ratings
    private BigDecimal rating;

    // Content Arrays
    private List<String> benefits;
    private List<String> requirements;
    private List<String> lessons;
    private List<String> learningOutcomes;
    private List<String> includes;
    private List<String> targetAudience;

    // Certificate
    private Boolean certificate;
    private String certificateType;

    // Images
    private String courseImageUrl;
    private String courseImageFileKey;

    // Contact Information
    private String contactEmail;
    private String contactPhone;

    // Curriculum (JSON string with modules and lessons)
//    private String curriculum;
    private Curriculum curriculum;

    // Status & Tracking
    private String status;
    private Integer viewCount;
    private Integer enrollmentCount;
    private Long postedHoursAgo;

    // Flags
    private Boolean isEnrolled;
    private Boolean isSaved;

    // Timestamps
    private LocalDateTime postedDate;
    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Company Details
    private CompanyDetailsResponse company;
}