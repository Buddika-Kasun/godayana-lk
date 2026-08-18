package com.godayana.job.dto.response;

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
public class JobApplicationSeekerResponse {
    private UUID id;
    private UUID jobId;
    private String jobTitle;
    private String location;
    private String companyName;
    private String logoUrl;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime savedAt;
}