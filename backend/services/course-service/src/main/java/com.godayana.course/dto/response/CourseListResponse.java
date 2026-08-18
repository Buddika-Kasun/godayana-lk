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
public class CourseListResponse {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String title;
    private String category;
    private String enrollType;
    private String location;
    private BigDecimal price;
    private String status;
    private Integer enrollmentCount;
    private Integer viewCount;
    private Long postedHoursAgo;
    private LocalDateTime createdAt;

    private CompanyDetailsResponse company;
}