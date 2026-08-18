package com.godayana.job.dto.response;

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
public class JobPublicListResponse {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String logoUrl;
    private String jobTitle;
    private String category;
    private String status;
    private String type;
    private String employmentType;
    private String location;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private Integer views;
    private Integer applications;
    private LocalDateTime createdAt;
}