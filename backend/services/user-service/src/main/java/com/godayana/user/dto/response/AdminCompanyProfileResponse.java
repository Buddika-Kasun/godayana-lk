package com.godayana.user.dto.response;

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
public class AdminCompanyProfileResponse {
    private UUID userId;
    private String companyName;
    private String logoUrl;
    private String industry;
    private String companyEmail;
    private String hotlineNumber;
    private String contactPersonName;
    private String designation;
    private String status;
    private long jobCount;
    private long courseCount;
    private boolean activation;
    private LocalDateTime createdAt;
}