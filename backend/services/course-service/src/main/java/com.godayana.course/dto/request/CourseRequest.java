// CourseRequest.java
package com.godayana.course.dto.request;

import com.godayana.course.dto.Curriculum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {

    @NotBlank(message = "Course title is required")
    private String title;

    private String category;
    private String categoryLabel;
    private String description;

    @NotNull(message = "Enrollment type is required")
    private String enrollType; // online or physical

    private String location;
    private String instructor;
    private String instructorBio;
    private String instructorAvatar;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String duration;
    private String schedule;
    private BigDecimal price;
    private Integer maxStudents;
    private Integer enrolledStudents;
    private BigDecimal rating;

    private List<String> migrationPaths;
    private String requirementLevel;

    private List<String> benefits;
    private List<String> requirements;
    private List<String> lessons;
    private List<String> learningOutcomes;
    private List<String> includes;
    private List<String> targetAudience;

    private Boolean certificate;
    private String certificateType;

    private String courseImageFileKey;
    private String contactEmail;
    private String contactPhone;

//    private String curriculum; // JSON string for modules/lessons
    private Curriculum curriculum;
    private LocalDateTime postedDate;
    private LocalDateTime lastUpdated;
    private Boolean isEnrolled;
    private Boolean isSaved;
    private String status;
}