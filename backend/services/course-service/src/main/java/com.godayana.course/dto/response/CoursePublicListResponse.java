package com.godayana.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursePublicListResponse {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String logoUrl;
    private String courseTitle;
    private String category;
    private String status;
    private String enrollType;
    private String location;
    private BigDecimal price;
    private String[] migrationPaths;
    private String requirementLevel;
    private String duration;
    private Integer courseLevel;
    private String startDate;
    private Integer viewCount;
    private Integer enrollmentCount;
    private LocalDateTime createdAt;
}