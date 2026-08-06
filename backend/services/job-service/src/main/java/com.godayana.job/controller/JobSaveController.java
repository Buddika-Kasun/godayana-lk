package com.godayana.job.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.job.dto.response.JobSaveResponse;
import com.godayana.job.service.interfaces.IJobSaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/jobs/save")
@RequiredArgsConstructor
@Slf4j
public class JobSaveController {

    private final IJobSaveService jobSaveService;

    @PostMapping("/{jobId}")
    public ApiResponse<JobSaveResponse> saveJob(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID jobId
    ) {
        log.info("Save job: {} by seeker: {}", jobId, seekerId);
        return ApiResponse.success(jobSaveService.saveJob(UUID.fromString(seekerId), jobId));
    }

    @GetMapping
    public ApiResponse<Page<JobSaveResponse>> getSavedJobBySeeker(
            @RequestHeader("X-User-Id") String seekerId,
            Pageable pageable) {
        log.info("Fetching saved jobs by seeker: {}", seekerId);
        return ApiResponse.success(jobSaveService.getSavedJobsBySeeker(UUID.fromString(seekerId), pageable));
    }

    @DeleteMapping
    public ApiResponse<Void> removeAllSavedJob(
            @RequestHeader("X-User-Id") String seekerId
    ) {
        log.info("Remove saved jobs by seeker: {}", seekerId);
        jobSaveService.removeAllSeekerSavedJob(UUID.fromString(seekerId));
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{jobId}")
    public ApiResponse<Void> removeSavedJob(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID jobId
    ) {
        log.info("Remove saved job: {} by seeker: {}", jobId, seekerId);
        jobSaveService.removeSavedJob(UUID.fromString(seekerId), jobId);
        return ApiResponse.success(null);
    }

    @GetMapping("/count")
    public ApiResponse<Long> countSavedJobs(
            @RequestHeader("X-User-Id") String seekerId
    ) {
        log.info("Counting saved jobs of seeker: {}", seekerId);
        return ApiResponse.success(jobSaveService.countSavedJobsBySeeker(
                UUID.fromString(seekerId)));
    }

    @GetMapping("/check/{jobId}")
    public ApiResponse<Boolean> checkSavedJob(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID jobId
    ) {
        log.info("Checking saved jobs of seeker: {}", seekerId);
        return ApiResponse.success(jobSaveService.checkSavedJob(
                UUID.fromString(seekerId), jobId));
    }
}