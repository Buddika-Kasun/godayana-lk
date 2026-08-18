package com.godayana.job.service.impl;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.dto.seeker.SeekerDetailsResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.job.dto.JobApplicationSummary;
import com.godayana.job.dto.response.JobApplicationCompanyResponse;
import com.godayana.job.dto.response.JobApplicationCountsResponse;
import com.godayana.job.dto.response.JobApplicationResponse;
import com.godayana.job.dto.response.JobApplicationSeekerResponse;
import com.godayana.job.entity.Job;
import com.godayana.job.entity.JobApplication;
import com.godayana.job.repository.JobApplicationRepository;
import com.godayana.job.repository.JobRepository;
import com.godayana.job.repository.JobSaveRepository;
import com.godayana.job.service.interfaces.IJobApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobApplicationServiceImpl implements IJobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final JobSaveRepository savedJobRepository;

    private final WebClient.Builder webClientBuilder;

    @Value("${USER_SERVICE_URL}")
    private String userServiceUrl;

    @Override
    @Transactional
//    public JobApplicationResponse applyForJob(UUID seekerId, JobApplicationRequest request) {
    public JobApplicationResponse applyForJob(UUID seekerId, UUID jobId) {
//        log.info("Applying for job: {} by seeker: {}", request.getJobId(), seekerId);
        log.info("Applying for job: {} by seeker: {}", jobId, seekerId);

//        Job job = jobRepository.findById(request.getJobId())
//                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (job.getStatus() != Job.JobStatus.APPROVED) {
            throw new BusinessException("Job is not open for applications",
                    ErrorCode.BUSINESS_ERROR.getCode(), 400);
        }

//        if (jobApplicationRepository.existsBySeekerIdAndJobId(seekerId, request.getJobId())) {
        if (jobApplicationRepository.existsBySeekerIdAndJobId(seekerId, jobId)) {
            throw new BusinessException("You have already applied for this job",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(), 409);
        }

        JobApplication application = JobApplication.builder()
//                .jobId(request.getJobId())
                .jobId(jobId)
                .seekerId(seekerId)
//                .coverLetter(request.getCoverLetter())
                .status(JobApplication.ApplicationStatus.PENDING)
                .createdBy(seekerId)
                .build();

        application = jobApplicationRepository.save(application);
//        jobRepository.incrementApplicationCount(request.getJobId());
        jobRepository.incrementApplicationCount(jobId);

        return mapToResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationCompanyResponse> getApplicationsByJob(UUID jobId, UUID companyId, String status, Pageable pageable) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getCompanyId().equals(companyId)) {
            throw new BusinessException("You don't have permission to view these applications",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        Page<JobApplicationSummary> jobApplications;
        if (status.equalsIgnoreCase("shortlisted")) {
            jobApplications = jobApplicationRepository.findSummariesByJobIdAndStatus(
                    jobId,
                    List.of(
                            JobApplication.ApplicationStatus.SHORTLISTED,
                            JobApplication.ApplicationStatus.HIRED
                    ),
                    pageable
            );
        }
        else {
            jobApplications = jobApplicationRepository.findSummariesByJobIdAndStatus(
                    jobId,
                    List.of(
                            JobApplication.ApplicationStatus.valueOf(status)
                    ),
                    pageable
            );
        }

        // Get all seeker IDs from the jobs
        List<UUID> seekerIds = jobApplications.getContent().stream()
                .map(JobApplicationSummary::getSeekerId)
                .distinct()
                .toList();

        // Batch fetch company details
        Map<UUID, SeekerDetailsResponse> seekerDetailsMap = getSeekerDetailsBatch(seekerIds);

        // Map to seeker list response with company details
        return jobApplications.map(jobApplication -> mapToCompanyListResponse(
                jobApplication,
                seekerDetailsMap
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public JobApplicationCountsResponse countJobApplicationsBySeeker(UUID seekerId) {
        long total = jobApplicationRepository.countBySeekerId(seekerId);
        long pending = jobApplicationRepository.countBySeekerIdAndStatus(seekerId, JobApplication.ApplicationStatus.PENDING);
        long shortlisted = jobApplicationRepository.countBySeekerIdAndStatus(seekerId, JobApplication.ApplicationStatus.SHORTLISTED);
        long hired = jobApplicationRepository.countBySeekerIdAndStatus(seekerId, JobApplication.ApplicationStatus.HIRED);
        long rejected = jobApplicationRepository.countBySeekerIdAndStatus(seekerId, JobApplication.ApplicationStatus.REJECTED);

        return JobApplicationCountsResponse.builder()
                .all(total)
                .pending(pending)
                .active(shortlisted + hired)
                .rejected(rejected)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public JobApplicationCountsResponse countJobApplicationsByJob(UUID jobId) {

        String jobTitle = jobRepository.findJobNameById(jobId);
        long total = jobApplicationRepository.countByJobId(jobId);
        long pending = jobApplicationRepository.countByJobIdAndStatus(jobId, JobApplication.ApplicationStatus.PENDING);
        long shortlisted = jobApplicationRepository.countByJobIdAndStatus(jobId, JobApplication.ApplicationStatus.SHORTLISTED);
        long hired = jobApplicationRepository.countByJobIdAndStatus(jobId, JobApplication.ApplicationStatus.HIRED);
        long rejected = jobApplicationRepository.countByJobIdAndStatus(jobId, JobApplication.ApplicationStatus.REJECTED);

        return JobApplicationCountsResponse.builder()
                .jobTitle(jobTitle)
                .all(total)
                .pending(pending)
                .active(shortlisted + hired)
                .shortlisted(shortlisted)
                .hired(hired)
                .rejected(rejected)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationSeekerResponse> getApplicationsBySeekerAndStatus(UUID seekerId, String status, Pageable pageable) {
        Page<JobApplicationSummary> jobApplications;
        if (status.equalsIgnoreCase("active")) {
            jobApplications = jobApplicationRepository.findSummariesBySeekerIdAndStatuses(
                    seekerId,
                    List.of(
                            JobApplication.ApplicationStatus.SHORTLISTED,
                            JobApplication.ApplicationStatus.HIRED,
                            JobApplication.ApplicationStatus.REVIEWED
                    ),
                    pageable
            );
        }
        else if (status.equalsIgnoreCase("saved")) {
            jobApplications = savedJobRepository.findSaveSummariesBySeekerIdAndStatuses(
                    seekerId,
                    pageable
            );
        }
        else {
            jobApplications = jobApplicationRepository.findSummariesBySeekerIdAndStatuses(
                    seekerId,
                    List.of(JobApplication.ApplicationStatus.valueOf(status)),
                    pageable
            );
        }

        // Get all company IDs from the jobs
        List<UUID> companyIds = jobApplications.getContent().stream()
                .map(JobApplicationSummary::getCompanyId)
                .distinct()
                .toList();

        // Batch fetch company details
        Map<UUID, CompanyDetailsResponse> companyDetailsMap = getCompanyDetailsBatch(companyIds);

        // Map to seeker list response with company details
        return jobApplications.map(jobApplication -> mapToSeekerListResponse(
                jobApplication,
                companyDetailsMap
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UUID> getApplicationsJobsIdsBySeeker(UUID seekerId, Pageable pageable) {
        return jobApplicationRepository.findApplicationIdsBySeekerId(seekerId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public JobApplicationResponse getApplicationById(UUID applicationId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        return mapToResponse(application);
    }

    @Override
    @Transactional
    public JobApplicationResponse updateApplicationStatus(UUID applicationId, UUID companyId, String status) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        JobApplication finalApplication = application;
        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", finalApplication.getJobId()));

        if (!job.getCompanyId().equals(companyId)) {
            throw new BusinessException("You don't have permission to update this application",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        application.setStatus(JobApplication.ApplicationStatus.valueOf(status));
        application = jobApplicationRepository.save(application);

        return mapToResponse(application);
    }

    @Override
    @Transactional
    public void withdrawApplication(UUID applicationId, UUID seekerId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!application.getSeekerId().equals(seekerId)) {
            throw new BusinessException("You don't have permission to withdraw this application",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        jobApplicationRepository.delete(application);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasApplied(UUID seekerId, UUID jobId) {
        return jobApplicationRepository.existsBySeekerIdAndJobId(seekerId, jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countApplicationsByJob(UUID jobId) {
        return jobApplicationRepository.countByJobId(jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countApplicationsByJobAndStatus(UUID jobId, String status) {
        return jobApplicationRepository.countByJobIdAndStatus(jobId,
                JobApplication.ApplicationStatus.valueOf(status));
    }

    /**
     * Batch fetch company details for multiple companies
     */
    private Map<UUID, CompanyDetailsResponse> getCompanyDetailsBatch(List<UUID> companyIds) {
        Map<UUID, CompanyDetailsResponse> result = new HashMap<>();

        if (companyIds == null || companyIds.isEmpty()) {
            return result;
        }

        try {
            ApiResponse<Map<UUID, CompanyDetailsResponse>> response = webClientBuilder.build()
                    .post()
                    .uri(userServiceUrl + "/api/v1/company/profiles/internal/batch")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(companyIds)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<Map<UUID, CompanyDetailsResponse>>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                result.putAll(response.getData());
            }
        } catch (Exception e) {
            log.error("Failed to fetch company details in batch", e);
        }

        return result;
    }

    /**
     * Batch fetch seeker details for multiple companies
     */
    private Map<UUID, SeekerDetailsResponse> getSeekerDetailsBatch(List<UUID> seekerIds) {
        Map<UUID, SeekerDetailsResponse> result = new HashMap<>();

        if (seekerIds == null || seekerIds.isEmpty()) {
            return result;
        }

        try {
            ApiResponse<Map<UUID, SeekerDetailsResponse>> response = webClientBuilder.build()
                    .post()
                    .uri(userServiceUrl + "/api/v1/seeker/profiles/internal/batch")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(seekerIds)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<Map<UUID, SeekerDetailsResponse>>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                result.putAll(response.getData());
            }
        } catch (Exception e) {
            log.error("Failed to fetch seeker details in batch", e);
        }

        return result;
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJobId())
                .seekerId(application.getSeekerId())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus() != null ? application.getStatus().toString() : null)
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }

    private JobApplicationSeekerResponse mapToSeekerListResponse(
            JobApplicationSummary jobApplication,
            Map<UUID, CompanyDetailsResponse> companyDetailsMap
    ) {
        if (jobApplication == null) {
            throw new BusinessException("Job application cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get company details from the map
        CompanyDetailsResponse company = null;
        String companyName = "Company";
        String logoUrl = "";

        if (companyDetailsMap != null && companyDetailsMap.containsKey(jobApplication.getCompanyId())) {
            company = companyDetailsMap.get(jobApplication.getCompanyId());
            if (company != null && company.getCompanyName() != null) {
                companyName = company.getCompanyName();
                logoUrl = company.getLogoUrl();
            }
        }

        // Safely calculate hours ago
//        long hoursAgo = calculateHoursAgo(jobApplication.getAppliedAt());

        return JobApplicationSeekerResponse.builder()
                .id(jobApplication.getId())
                .jobId(jobApplication.getJobId())
                .jobTitle(jobApplication.getJobTitle())
                .companyName(companyName)
                .logoUrl(logoUrl)
                .location(jobApplication.getLocation())
                .status(jobApplication.getStatus() != null ? jobApplication.getStatus().toString() : null)
                .appliedAt(jobApplication.getAppliedAt())
                .savedAt(jobApplication.getSavedAt())
                .build();
    }

    private JobApplicationCompanyResponse mapToCompanyListResponse(
            JobApplicationSummary jobApplication,
            Map<UUID, SeekerDetailsResponse> seekerDetailsMap
    ) {
        if (jobApplication == null) {
            throw new BusinessException("Job application cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get seeker details from the map
        SeekerDetailsResponse seeker = null;
        String seekerName = "Seeker";
        String seekerEmail = "";
        String seekerProfileUrl = "";
        String seekerCvUrl = "";
        UUID seekerId = null;
        Integer seekerExperience = null;
        String contactNo = "";

        if (seekerDetailsMap != null && seekerDetailsMap.containsKey(jobApplication.getSeekerId())) {
            seeker = seekerDetailsMap.get(jobApplication.getSeekerId());
            if (seeker != null && seeker.getFullName() != null) {
                seekerId = seeker.getUserId();
                seekerName = seeker.getFullName();
                seekerEmail = seeker.getEmail();
                seekerProfileUrl = seeker.getProfileUrl();
                seekerCvUrl = seeker.getCvUrl();
                seekerExperience = seeker.getExperience();
                contactNo = seeker.getContactNo();
            }
        }

        // Safely calculate hours ago
//        long hoursAgo = calculateHoursAgo(jobApplication.getAppliedAt());

        return JobApplicationCompanyResponse.builder()
                .id(jobApplication.getId())
                .seekerId(seekerId)
                .seekerName(seekerName)
                .seekerEmail(seekerEmail)
                .seekerProfileUrl(seekerProfileUrl)
                .seekerCvUrl(seekerCvUrl)
                .seekerExperience(seekerExperience)
                .seekerContactNo(contactNo)
                .status(jobApplication.getStatus() != null ? jobApplication.getStatus().toString() : null)
                .appliedAt(jobApplication.getAppliedAt())
                .build();
    }

}