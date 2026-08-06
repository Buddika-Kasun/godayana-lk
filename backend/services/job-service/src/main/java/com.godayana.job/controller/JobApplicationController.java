package com.godayana.job.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.job.dto.request.JobApplicationRequest;
import com.godayana.job.dto.response.JobApplicationCompanyResponse;
import com.godayana.job.dto.response.JobApplicationCountsResponse;
import com.godayana.job.dto.response.JobApplicationResponse;
import com.godayana.job.dto.response.JobApplicationSeekerResponse;
import com.godayana.job.service.interfaces.IJobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Slf4j
public class JobApplicationController {

    private final IJobApplicationService jobApplicationService;

    @PostMapping
    public ApiResponse<JobApplicationResponse> applyForJob(
            @RequestHeader("X-User-Id") String seekerId,
            @Valid @RequestBody JobApplicationRequest request
//            @PathVariable(required = true) UUID jobId
    ) {
        log.info("Applying for job: {} by seeker: {}", request.getJobId(), seekerId);
//        log.info("Applying for job: {} by seeker: {}", jobId, seekerId);
//        return ApiResponse.success(jobApplicationService.applyForJob(UUID.fromString(seekerId), request));
        return ApiResponse.success(jobApplicationService.applyForJob(UUID.fromString(seekerId), UUID.fromString(request.getJobId())));
    }

    @GetMapping("/job/{jobId}")
    public ApiResponse<Page<JobApplicationCompanyResponse>> getApplicationsByJob(
            @RequestHeader("X-User-Id") String companyId,
            @PathVariable UUID jobId,
            @RequestParam String status,
            Pageable pageable) {
        log.info("Fetching applications for job: {} by company: {}", jobId, companyId);
        return ApiResponse.success(jobApplicationService.getApplicationsByJob(jobId,
                UUID.fromString(companyId), status, pageable));
    }

    @GetMapping("/count")
    public ApiResponse<JobApplicationCountsResponse> countJobApplications(
            @RequestHeader("X-User-Id") String seekerId
    ) {
        log.info("Counting applied jobs of seeker: {}", seekerId);
        return ApiResponse.success(jobApplicationService.countJobApplicationsBySeeker(
                UUID.fromString(seekerId)));
    }

    @GetMapping("/company/count/{jobId}")
    public ApiResponse<JobApplicationCountsResponse> countCompanyJobApplications(
            @PathVariable String jobId
    ) {
        log.info("Counting applications of job: {}", jobId);
        return ApiResponse.success(jobApplicationService.countJobApplicationsByJob(
                UUID.fromString(jobId)));
    }

    @GetMapping("/me")
    public ApiResponse<Page<JobApplicationSeekerResponse>> getMyApplications(
            @RequestHeader("X-User-Id") String seekerId,
            @RequestParam String status,
            Pageable pageable) {
        log.info("Fetching applications for seeker: {}", seekerId);
        return ApiResponse.success(jobApplicationService.getApplicationsBySeekerAndStatus(
                UUID.fromString(seekerId), status, pageable));
    }

    @GetMapping("/me/ids")
    public ApiResponse<Page<UUID>> getMyApplicationJobIds(
            @RequestHeader("X-User-Id") String seekerId,
            Pageable pageable) {
        log.info("Fetching application jobs for seeker: {}", seekerId);
        return ApiResponse.success(jobApplicationService.getApplicationsJobsIdsBySeeker(
                UUID.fromString(seekerId), pageable));
    }

    @GetMapping("/{applicationId}")
    public ApiResponse<JobApplicationResponse> getApplicationById(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID applicationId) {
        log.info("Fetching application: {} by user: {}", applicationId, userId);
        return ApiResponse.success(jobApplicationService.getApplicationById(applicationId));
    }

    @PutMapping("/{applicationId}/status")
    public ApiResponse<JobApplicationResponse> updateApplicationStatus(
            @RequestHeader("X-User-Id") String companyId,
            @PathVariable UUID applicationId,
            @RequestParam String status) {
        log.info("Updating application: {} status to: {} by company: {}",
                applicationId, status, companyId);
        return ApiResponse.success(jobApplicationService.updateApplicationStatus(
                applicationId, UUID.fromString(companyId), status));
    }

    @DeleteMapping("/{applicationId}")
    public ApiResponse<Void> withdrawApplication(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID applicationId) {
        log.info("Withdrawing application: {} by seeker: {}", applicationId, seekerId);
        jobApplicationService.withdrawApplication(applicationId, UUID.fromString(seekerId));
        return ApiResponse.success(null);
    }

    @GetMapping("/check")
    public ApiResponse<Boolean> hasApplied(
            @RequestHeader("X-User-Id") String seekerId,
            @RequestParam UUID jobId) {
        log.info("Checking if seeker: {} has applied for job: {}", seekerId, jobId);
        return ApiResponse.success(jobApplicationService.hasApplied(
                UUID.fromString(seekerId), jobId));
    }
}