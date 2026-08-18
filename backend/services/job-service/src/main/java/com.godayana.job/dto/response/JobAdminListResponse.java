package com.godayana.job.dto.response;

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
public class JobAdminListResponse {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String logoUrl;
    private String jobTitle;
    private String jobType;
    private String status;
    private Integer views;
    private String location;
    private Integer applications;
    private LocalDateTime createdAt;
}