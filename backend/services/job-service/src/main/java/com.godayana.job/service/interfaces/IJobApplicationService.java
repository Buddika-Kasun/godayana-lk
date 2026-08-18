package com.godayana.job.service.interfaces;

import com.godayana.job.dto.response.JobApplicationCompanyResponse;
import com.godayana.job.dto.response.JobApplicationCountsResponse;
import com.godayana.job.dto.response.JobApplicationResponse;
import com.godayana.job.dto.response.JobApplicationSeekerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IJobApplicationService {

//    JobApplicationResponse applyForJob(UUID seekerId, JobApplicationRequest request);
    JobApplicationResponse applyForJob(UUID seekerId, UUID jobId);

    Page<JobApplicationCompanyResponse> getApplicationsByJob(UUID jobId, UUID companyId, String status, Pageable pageable);

    JobApplicationCountsResponse countJobApplicationsBySeeker(UUID seekerId);

    JobApplicationCountsResponse countJobApplicationsByJob(UUID jobId);

    Page<JobApplicationSeekerResponse> getApplicationsBySeekerAndStatus(UUID seekerId, String status, Pageable pageable);

    Page<UUID> getApplicationsJobsIdsBySeeker(UUID seekerId, Pageable pageable);

    JobApplicationResponse getApplicationById(UUID applicationId);

    JobApplicationResponse updateApplicationStatus(UUID applicationId, UUID companyId, String status);

    void withdrawApplication(UUID applicationId, UUID seekerId);

    boolean hasApplied(UUID seekerId, UUID jobId);

    long countApplicationsByJob(UUID jobId);

    long countApplicationsByJobAndStatus(UUID jobId, String status);
}