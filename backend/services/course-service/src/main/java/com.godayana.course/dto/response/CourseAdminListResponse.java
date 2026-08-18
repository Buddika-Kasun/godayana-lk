package com.godayana.course.dto.response;

import com.godayana.dto.company.CompanyDetailsResponse;
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
public class CourseAdminListResponse {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String logoUrl;
    private String courseTitle;
    private String enrollType;
    private String location;
    private BigDecimal price;
    private String status;
    private Integer maxStudents;
    private Integer enrolledStudents;
    private Integer views;
    private LocalDateTime createdAt;
}