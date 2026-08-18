package com.godayana.job.dto;

import com.godayana.job.entity.JobApplication;
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
public class JobApplicationSummary {
    private UUID id;
    private UUID jobId;
    private UUID seekerId;
    private JobApplication.ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime savedAt;
    private String jobTitle;
    private String location;
    private UUID companyId;

    // Constructor for Job Applications
    public JobApplicationSummary(UUID id, UUID jobId, UUID seekerId,
                                 JobApplication.ApplicationStatus status,
                                 LocalDateTime appliedAt,
                                 String jobTitle, String location, UUID companyId) {
        this.id = id;
        this.jobId = jobId;
        this.seekerId = seekerId;
        this.status = status;
        this.appliedAt = appliedAt;
        this.jobTitle = jobTitle;
        this.location = location;
        this.companyId = companyId;
        this.savedAt = null;
    }

    // Constructor for Saved Jobs
    public JobApplicationSummary(UUID jobId, UUID seekerId, String jobTitle,
                                 String location, UUID companyId,
                                 LocalDateTime savedAt,
                                 JobApplication.ApplicationStatus status) {
        this.jobId = jobId;
        this.seekerId = seekerId;
        this.jobTitle = jobTitle;
        this.location = location;
        this.companyId = companyId;
        this.savedAt = savedAt;
        this.status = status;
        this.id = null;
        this.appliedAt = null;
    }
}