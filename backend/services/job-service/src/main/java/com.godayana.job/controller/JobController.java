package com.godayana.job.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.job.dto.request.JobRequest;
import com.godayana.job.dto.response.*;
import com.godayana.job.service.interfaces.IJobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobController {

    private final IJobService jobService;

    @PostMapping
    public ApiResponse<JobResponse> createJob(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody JobRequest request) {
        log.info("Creating job for user: {}", userId);
        return ApiResponse.success(jobService.createJob(UUID.fromString(userId), request));
    }

    @PutMapping("/{jobId}")
    public ApiResponse<JobResponse> updateJob(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID jobId,
            @Valid @RequestBody JobRequest request) {
        log.info("Updating job: {} for user: {}", jobId, userId);
        return ApiResponse.success(jobService.updateJob(jobId, UUID.fromString(userId), request));
    }

    @GetMapping("/public/{jobId}")
    public ApiResponse<JobResponse> getJobById(
            @PathVariable UUID jobId,
            @RequestParam(required = false) Boolean isVisited
    ) {
        log.info("Fetching job: {}", jobId);
        return ApiResponse.success(jobService.getJobById(jobId, isVisited));
    }

    @GetMapping
    public ApiResponse<Page<JobListResponse>> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching all jobs with filters");
        return ApiResponse.success(jobService.getAllJobs(search, location, type,
                employmentType, category, status, pageable));
    }

    @GetMapping("/admin")
    public ApiResponse<Page<JobAdminListResponse>> getAdminAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching all jobs with filters for admin");
        return ApiResponse.success(jobService.getAdminAllJobs(search, location, type,
                employmentType, category, status, pageable));
    }

    @GetMapping("/company")
    public ApiResponse<Page<JobListResponse>> getJobsByCompany(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching jobs for company: {}", userId);
        return ApiResponse.success(jobService.getJobsByCompany(UUID.fromString(userId), status, pageable));
    }

    @GetMapping("/pending")
    public ApiResponse<Page<JobListResponse>> getPendingJobs(Pageable pageable) {
        log.info("Fetching pending jobs for admin approval");
        return ApiResponse.success(jobService.getPendingJobs(pageable));
    }

    @PostMapping("/{jobId}/approve")
    public ApiResponse<Void> approveJob(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID jobId) {
        log.info("Approving job: {} by admin: {}", jobId, adminId);
        jobService.approveJob(jobId, UUID.fromString(adminId));
        return ApiResponse.success(null);
    }

    @PostMapping("/{jobId}/reject")
    public ApiResponse<Void> rejectJob(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID jobId,
            @RequestParam String reason) {
        log.info("Rejecting job: {} by admin: {}", jobId, adminId);
        jobService.rejectJob(jobId, UUID.fromString(adminId), reason);
        return ApiResponse.success(null);
    }

    @PostMapping("/{jobId}/close")
    public ApiResponse<JobResponse> closeJob(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID jobId) {
        log.info("Closing job: {} by user: {}", jobId, userId);
        return ApiResponse.success(jobService.closeJob(jobId, UUID.fromString(userId)));
    }

    @DeleteMapping("/{jobId}")
    public ApiResponse<Void> deleteJob(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID jobId) {
        log.info("Deleting job: {} by user: {}", jobId, userId);
        jobService.deleteJob(jobId, UUID.fromString(userId));
        return ApiResponse.success(null);
    }

    @GetMapping("/search")
    public ApiResponse<Page<JobListResponse>> searchJobs(
            @RequestParam String keyword,
            Pageable pageable) {
        log.info("Searching jobs with keyword: {}", keyword);
        return ApiResponse.success(jobService.searchJobs(keyword, pageable));
    }

    @GetMapping("/public/search")
    public ApiResponse<Page<JobPublicListResponse>> getPublicJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String type,
            Pageable pageable) {
        log.info("Searching jobs with keyword: {}", keyword);
        return ApiResponse.success(jobService.getPublicJobs(keyword, location, category, employmentType, experience, type, pageable));
    }

    @GetMapping("/stats")
    public ApiResponse<JobStats> getJobStats() {
        log.info("Fetching job statistics");
        return ApiResponse.success(JobStats.builder()
                .totalApproved(jobService.countJobsByStatus("APPROVED"))
                .totalPending(jobService.countJobsByStatus("PENDING"))
                .totalRejected(jobService.countJobsByStatus("REJECTED"))
                .totalClosed(jobService.countJobsByStatus("CLOSED"))
                .totalDraft(jobService.countJobsByStatus("DRAFT"))
                .build());
    }

    @GetMapping("/company/stats")
    public ApiResponse<JobStats> getCompanyJobStats(@RequestHeader("X-User-Id") String userId) {
        log.info("Fetching job statistics for company: {}", userId);
        return ApiResponse.success(JobStats.builder()
                .totalApproved(jobService.countJobsByCompany(UUID.fromString(userId)))
                .build());
    }

    @GetMapping("/company/counts")
    public ApiResponse<JobCountsResponse> getCompanyJobCounts(
            @RequestHeader("X-User-Id") String userId) {
        log.info("Getting job counts for company: {}", userId);
        return ApiResponse.success(jobService.getCompanyJobCounts(UUID.fromString(userId)));
    }

    @GetMapping("/admin/counts")
    public ApiResponse<JobCountsResponse> getAdminJobCounts(
//            @RequestHeader("X-User-Id") String userId
    ) {
//        log.info("Getting job counts for admin: {}", userId);
        return ApiResponse.success(jobService.getAdminJobCounts());
    }

    @GetMapping("/company/{jobId}")
    public ApiResponse<JobResponse> getCompanyJobById(@PathVariable UUID jobId) {
        log.info("Fetching company job: {}", jobId);
        return ApiResponse.success(jobService.getCompanyJobById(jobId));
    }

    @PostMapping("/upload/job-image")
    public ApiResponse<JobImageUploadResponse> uploadJobImage(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(jobService.uploadJobImage(UUID.fromString(userId), file));
    }

}