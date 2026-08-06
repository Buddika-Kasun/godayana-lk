package com.godayana.job.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.godayana.dto.ApiResponse;
import com.godayana.dto.ApiResponseWrapper;
import com.godayana.dto.FileUploadResponse;
import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.job.dto.request.JobRequest;
import com.godayana.job.dto.response.*;
import com.godayana.job.entity.Job;
import com.godayana.job.repository.JobRepository;
import com.godayana.job.service.interfaces.IJobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.apache.http.HttpStatus;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobServiceImpl implements IJobService {

    private final JobRepository jobRepository;
    private final ObjectMapper objectMapper;

    private final WebClient.Builder webClientBuilder;

    @Value("${FILE_SERVICE_URL}")
    private String fileServiceUrl;

    @Value("${USER_SERVICE_URL}")
    private String userServiceUrl;

    // Cache for company names to avoid repeated calls
//    private final Map<UUID, String> companyNameCache = new ConcurrentHashMap<>();

    @Override
    @Transactional
    public JobResponse createJob(UUID companyId, JobRequest request) {
        log.info("Creating job for company: {}", companyId);

        // Convert MatchingCriteria to JSON string
        String matchingCriteriaJson = null;
        if (request.getMatchingCriteria() != null) {
            try {
                matchingCriteriaJson = objectMapper.writeValueAsString(request.getMatchingCriteria());
            } catch (Exception e) {
                log.error("Failed to convert matching criteria to JSON", e);
                throw new BusinessException("Invalid matching criteria format",
                        ErrorCode.INVALID_INPUT.getCode(), 400);
            }
        }

        Job.JobStatus status = Job.JobStatus.PENDING;
        if ("draft".equalsIgnoreCase(request.getStatus())) {
            status = Job.JobStatus.DRAFT;
        }

        Job job = Job.builder()
                .companyId(companyId)
                .jobTitle(request.getJobTitle())
                .category(request.getCategory())
                .location(request.getLocation())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .salaryNegotiable(request.getSalaryNegotiable() != null ? request.getSalaryNegotiable() : false)
                .educationLevel(request.getEducationLevel())
                .minExperience(request.getMinExperience())
                .employmentType(request.getEmploymentType())
                .fieldOfStudy(request.getFieldOfStudy())
                .minAge(request.getMinAge())
                .maxAge(request.getMaxAge())
                .jobDescription(request.getJobDescription())
//                .workingHours(request.getWorkingHours())
                .workingHoursStart(request.getStartTime())
                .workingHoursEnd(request.getEndTime())
                .benefits(request.getBenefits())
                .applicationDeadline(request.getApplicationDeadline())
                .confirmationEmail(request.getConfirmationEmail())
                .type(Job.JobType.valueOf(request.getType()))
                .skills(request.getSkills() != null ? request.getSkills().toArray(new String[0]) : null)
                .descriptionImageUrl(request.getDescriptionImageFileKey())
                .cvDeliveryOption(Job.CvDeliveryOption.valueOf(request.getCvDeliveryOption()))
                .matchingCriteria(matchingCriteriaJson)
                .status(status)
                .viewCount(0)
                .applicationCount(0)
                .createdBy(companyId)
                .build();

        job = jobRepository.save(job);
        log.info("Job created with ID: {}", job.getId());

        return mapToResponse(job);
    }

    @Override
    @Transactional
    public JobResponse updateJob(UUID jobId, UUID companyId, JobRequest request) {
        log.info("Updating job: {} for company: {}", jobId, companyId);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getCompanyId().equals(companyId)) {
            throw new BusinessException("You don't have permission to update this job",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        if (job.getStatus() == Job.JobStatus.APPROVED || job.getStatus() == Job.JobStatus.CLOSED) {
            throw new BusinessException("Cannot edit an approved or closed job",
                    ErrorCode.BUSINESS_ERROR.getCode(), 400);
        }

        // Update fields
        job.setJobTitle(request.getJobTitle());
        job.setCategory(request.getCategory());
        job.setLocation(request.getLocation());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setSalaryNegotiable(request.getSalaryNegotiable() != null ? request.getSalaryNegotiable() : false);
        job.setEducationLevel(request.getEducationLevel());
        job.setMinExperience(request.getMinExperience());
        job.setEmploymentType(request.getEmploymentType());
        job.setFieldOfStudy(request.getFieldOfStudy());
        job.setMinAge(request.getMinAge());
        job.setMaxAge(request.getMaxAge());
        job.setJobDescription(request.getJobDescription());
//        job.setWorkingHours(request.getWorkingHours());
        job.setWorkingHoursStart(request.getStartTime());
        job.setWorkingHoursEnd(request.getEndTime());
        job.setBenefits(request.getBenefits());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setConfirmationEmail(request.getConfirmationEmail());
        job.setType(Job.JobType.valueOf(request.getType()));
        job.setSkills(request.getSkills() != null ? request.getSkills().toArray(new String[0]) : null);
        job.setDescriptionImageUrl(request.getDescriptionImageFileKey());

        // Update CV delivery options if provided
        if (request.getCvDeliveryOption() != null) {
            job.setCvDeliveryOption(Job.CvDeliveryOption.valueOf(request.getCvDeliveryOption()));
        }
        if (request.getMatchingCriteria() != null) {
            try {
                job.setMatchingCriteria(objectMapper.writeValueAsString(request.getMatchingCriteria()));
            } catch (Exception e) {
                log.error("Failed to convert matching criteria to JSON", e);
                throw new BusinessException("Invalid matching criteria format",
                        ErrorCode.INVALID_INPUT.getCode(), 400);
            }
        }

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    @Override
    @Transactional
    public JobResponse getJobById(UUID jobId, Boolean isVisited) {
        log.debug("Fetching job by ID: {}", jobId);

        // Find the job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        // Only allow viewing if status is APPROVED
        if (job.getStatus() != Job.JobStatus.APPROVED) {
            log.warn("Attempted to view non-approved job: {}, Status: {}", jobId, job.getStatus());
            throw new BusinessException(
                    "Job is not available for public viewing",
                    ErrorCode.RESOURCE_NOT_FOUND.getCode(),
                    404
            );
        }

        if (isVisited != null && !isVisited) {
            // Increment view count only for approved jobs
            incrementViewCount(jobId);
        }

        // Increment view count only for approved jobs
//        incrementViewCount(jobId);

        return mapToResponse(job, true);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getCompanyJobById(UUID jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        return mapToResponse(job, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobListResponse> getAllJobs(String search, String location, String type,
                                            String employmentType, String category,
                                            String status, Pageable pageable) {
        Job.JobStatus effectiveStatus = status != null ? Job.JobStatus.valueOf(status) : Job.JobStatus.APPROVED;
        return jobRepository.searchJobs(search, location, type, employmentType, category, effectiveStatus, pageable)
                .map(this::mapToListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobAdminListResponse> getAdminAllJobs(String search, String location, String type,
                                                      String employmentType, String category,
                                                      String status, Pageable pageable) {
//        Job.JobStatus effectiveStatus = status != null ? Job.JobStatus.valueOf(status) : Job.JobStatus.APPROVED;
//        return jobRepository.searchJobs(search, location, type, employmentType, category, effectiveStatus, pageable)
//                .map(this::mapToAdminListResponse);
        String effectiveStatus = status != null ? status : "APPROVED";
//        return jobRepository.searchJobsNative(search, location, type, employmentType, category, effectiveStatus, pageable)
//                .map(this::mapToAdminListResponse);

        Page<Job> jobPage = jobRepository.searchJobsNative(search, location, type, employmentType, category, effectiveStatus, pageable);

        // Get all company IDs from the jobs
        List<UUID> companyIds = jobPage.getContent().stream()
                .map(Job::getCompanyId)
                .distinct()
                .toList();

        // Batch fetch company details
        Map<UUID, CompanyDetailsResponse> companyDetailsMap = getCompanyDetailsBatch(companyIds);

        // Map to admin list response with company details
        return jobPage.map(job -> mapToAdminListResponse(job, companyDetailsMap));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPublicListResponse> getPublicJobs(String keyword, String location, String category,
                                                     String employmentType, String experience, String type, Pageable pageable) {
//        Job.JobStatus effectiveStatus = status != null ? Job.JobStatus.valueOf(status) : Job.JobStatus.APPROVED;
//        return jobRepository.searchJobs(search, location, type, employmentType, category, effectiveStatus, pageable)
//                .map(this::mapToAdminListResponse);
        String effectiveStatus = "APPROVED";
//        return jobRepository.searchJobsNative(search, location, type, employmentType, category, effectiveStatus, pageable)
//                .map(this::mapToAdminListResponse);

        Page<Job> jobPage = jobRepository.searchPublicJobsNative(keyword, location, category, employmentType, experience, effectiveStatus, type, pageable);

        // Get all company IDs from the jobs
        List<UUID> companyIds = jobPage.getContent().stream()
                .map(Job::getCompanyId)
                .distinct()
                .toList();

        // Batch fetch company details
        Map<UUID, CompanyDetailsResponse> companyDetailsMap = getCompanyDetailsBatch(companyIds);

        // Map to admin list response with company details
        return jobPage.map(job -> mapToPublicListResponse(job, companyDetailsMap));
    }


    @Override
    @Transactional(readOnly = true)
    public Page<JobListResponse> getJobsByCompany(UUID companyId, String status, Pageable pageable) {
//        Job.JobStatus jobStatus = status != null ? Job.JobStatus.valueOf(status) : null;
        if (status == null || status.isEmpty()) {
            return jobRepository.findByCompanyId(companyId, pageable).map(this::mapToListResponse);
        } else if (status.equalsIgnoreCase("closed")) {
            return jobRepository.findByCompanyIdAndStatusIn(
                    companyId,
                    List.of(Job.JobStatus.CLOSED, Job.JobStatus.REJECTED),
                    pageable
            ).map(this::mapToListResponse);
        } else {
            return jobRepository.findByCompanyIdAndStatus(companyId, Job.JobStatus.valueOf(status), pageable)
                    .map(this::mapToListResponse);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobListResponse> getPendingJobs(Pageable pageable) {
        return jobRepository.findByStatus(Job.JobStatus.PENDING, pageable)
                .map(this::mapToListResponse);
    }

    @Override
    @Transactional
    public void approveJob(UUID jobId, UUID adminId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!(job.getStatus() == Job.JobStatus.PENDING | job.getStatus() == Job.JobStatus.REJECTED)) {
            throw new BusinessException("Job is not in pending or rejected state",
                    ErrorCode.INVALID_STATUS_TRANSITION.getCode(), 400);
        }

        job.setStatus(Job.JobStatus.APPROVED);
        job.setApprovedBy(adminId);
        job.setApprovedAt(LocalDateTime.now());
        job = jobRepository.save(job);

//        return mapToResponse(job);
    }

    @Override
    @Transactional
    public void rejectJob(UUID jobId, UUID adminId, String reason) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!(job.getStatus() == Job.JobStatus.PENDING | job.getStatus() == Job.JobStatus.APPROVED)) {
            throw new BusinessException("Job is not in pending or approved state",
                    ErrorCode.INVALID_STATUS_TRANSITION.getCode(), 400);
        }

        job.setStatus(Job.JobStatus.REJECTED);
        job.setApprovedBy(adminId);
        job.setApprovedAt(LocalDateTime.now());
        job = jobRepository.save(job);

//        return mapToResponse(job);
    }

    @Override
    @Transactional
    public JobResponse closeJob(UUID jobId, UUID userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getCompanyId().equals(userId)) {
            throw new BusinessException("You don't have permission to close this job",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        job.setStatus(Job.JobStatus.CLOSED);
        job = jobRepository.save(job);

        return mapToResponse(job);
    }

    @Override
    @Transactional
    public void deleteJob(UUID jobId, UUID userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getCompanyId().equals(userId)) {
            throw new BusinessException("You don't have permission to delete this job",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        jobRepository.delete(job);
    }

    @Override
    @Transactional
    public void incrementViewCount(UUID jobId) {
        jobRepository.incrementViewCount(jobId);
    }

    @Override
    @Transactional
    public void incrementApplicationCount(UUID jobId) {
        jobRepository.incrementApplicationCount(jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobListResponse> getRecommendedJobs(UUID seekerId, Pageable pageable) {
        return jobRepository.findByStatus(Job.JobStatus.APPROVED, pageable)
                .map(this::mapToListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobListResponse> searchJobs(String keyword, Pageable pageable) {
        return jobRepository.searchByKeyword(keyword, pageable)
                .map(this::mapToListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long countJobsByStatus(String status) {
        return jobRepository.countByStatus(Job.JobStatus.valueOf(status));
    }

    @Override
    @Transactional(readOnly = true)
    public long countJobsByCompany(UUID companyId) {
        return jobRepository.countByCompanyId(companyId);
    }

    @Override
    @Transactional(readOnly = true)
    public JobCountsResponse getCompanyJobCounts(UUID companyId) {
        log.debug("Getting job counts for company: {}", companyId);

        long total = jobRepository.countByCompanyId(companyId);
        long pending = jobRepository.countByCompanyIdAndStatus(companyId, Job.JobStatus.PENDING);
        long approved = jobRepository.countByCompanyIdAndStatus(companyId, Job.JobStatus.APPROVED);
        long rejected = jobRepository.countByCompanyIdAndStatus(companyId, Job.JobStatus.REJECTED);
        long closed = jobRepository.countByCompanyIdAndStatus(companyId, Job.JobStatus.CLOSED);
        long draft = jobRepository.countByCompanyIdAndStatus(companyId, Job.JobStatus.DRAFT);

        return JobCountsResponse.builder()
                .all(total)
                .pending(pending)
                .approved(approved)
                .rejected(rejected)
                .closed(closed)
                .draft(draft)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public JobCountsResponse getAdminJobCounts() {
        log.debug("Getting job counts for admin");

        long total = jobRepository.count();
        long pending = jobRepository.countByStatus(Job.JobStatus.PENDING);
        long approved = jobRepository.countByStatus(Job.JobStatus.APPROVED);
        long rejected = jobRepository.countByStatus(Job.JobStatus.REJECTED);
        long closed = jobRepository.countByStatus(Job.JobStatus.CLOSED);
        long draft = jobRepository.countByStatus(Job.JobStatus.DRAFT);

        return JobCountsResponse.builder()
                .all(total)
                .pending(pending)
                .approved(approved)
                .rejected(rejected)
                .closed(closed)
                .draft(draft)
                .build();
    }


    /**
     * Safely calculate hours between two times, handling null values
     */
    private long calculateHoursAgo(LocalDateTime createdAt) {
        if (createdAt == null) {
            return 0L;
        }
        try {
            return ChronoUnit.HOURS.between(createdAt, LocalDateTime.now());
        } catch (Exception e) {
            log.warn("Failed to calculate hours ago for createdAt: {}", createdAt, e);
            return 0L;
        }
    }

    @Override
    @Transactional
    public JobImageUploadResponse uploadJobImage(UUID companyId, MultipartFile file) {
        log.info("Uploading job image for company: {}", companyId);

        try {
            // Call file service to upload
            return uploadJobImageToFileService(file, "company-job-image", companyId.toString());

        } catch (Exception e) {
            //log.error("Failed to upload profile picture for user: {}", userId, e);
            throw new BusinessException(
                    "Failed to upload profile picture: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private JobImageUploadResponse uploadJobImageToFileService(MultipartFile file, String folder, String userId) {
        try {
            // Create multipart body
            MultiValueMap<String, Object> multipartBody = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            multipartBody.add("file", resource);

            // Use INTERNAL endpoint - this doesn't require X-User-Id header
            String internalUrl = fileServiceUrl + "/api/v1/files/internal/upload?folder=" + folder + "&userId=" + userId;

            ApiResponseWrapper<FileUploadResponse> responseWrapper = webClientBuilder.build()
                    .post()
                    .uri(internalUrl)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(multipartBody))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponseWrapper<FileUploadResponse>>() {})
                    .block();

            if (responseWrapper == null) {
                log.error("Response from file service is null");
                throw new BusinessException(
                        "No response from file service",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            if (!responseWrapper.getSuccess()) {
                log.error("File service returned error: {}", responseWrapper.getMessage());
                throw new BusinessException(
                        "File service error: " + responseWrapper.getMessage(),
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            FileUploadResponse data = responseWrapper.getData();
            if (data == null) {
                log.error("File service response data is null");
                throw new BusinessException(
                        "No data in file service response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            String fileKey = data.getFileKey();
            String fileUrl = data.getFileUrl();

            log.info("File uploaded successfully. FileId: {}, FileUrl: {}",
                    data.getFileId(), fileKey);

            if (fileKey == null || fileKey.isEmpty()) {
                throw new BusinessException(
                        "File URL not found in response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            return JobImageUploadResponse.builder()
                    .fileKey(fileKey)
                    .fileUrl(fileUrl)
                    .build();

        } catch (IOException e) {
            log.error("Failed to read file bytes", e);
            throw new BusinessException(
                    "Failed to read file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        } catch (Exception e) {
            log.error("Failed to upload file to file service", e);
            throw new BusinessException(
                    "Failed to upload file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private String getPresignedUrlFromFileService(String fileKey) {
        if (fileKey == null || fileKey.isEmpty()) {
            return null;
        }

        try {
            Map<String, String> requestBody = Map.of("fileKey", fileKey);

            // Use ParameterizedTypeReference for generic response
            ApiResponse<String> response = webClientBuilder.build()
                    .post()
                    .uri(fileServiceUrl + "/api/v1/files/internal/presigned-url")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<String>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }

            log.warn("Failed to get presigned URL for file key: {}, message: {}",
                    fileKey, response != null ? response.getMessage() : "Unknown error");
            return null;
        } catch (Exception e) {
            log.error("Failed to get presigned URL for file key: {}", fileKey, e);
            return null;
        }
    }

    /**
     * Get company name from User Service with caching
     */
    private CompanyDetailsResponse getCompany(UUID companyId) {
        if (companyId == null) {
            return null;
        }

        // Check cache first
//        if (companyNameCache.containsKey(companyId)) {
//            return companyNameCache.get(companyId);
//        }

        try {
            // Call User Service to get company profile
            ApiResponse<CompanyDetailsResponse> response = webClientBuilder.build()
                    .get()
                    .uri(userServiceUrl + "/api/v1/company/profiles/internal/{companyId}", companyId)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<CompanyDetailsResponse>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                CompanyDetailsResponse company = response.getData();
                // Cache the result
//                companyDetailsCache.put(companyId, company);
                log.debug("Fetched company details for ID: {}, Name: {}", companyId, company.getCompanyName());
                return company;
            }

            log.warn("Failed to get company for ID: {}, using default", companyId);
            return null;

        } catch (Exception e) {
            log.error("Error fetching company name for ID: {}", companyId, e);
            return null;
        }
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
     * Clear cache when needed (e.g., when company name is updated)
     */
//    public void clearCompanyNameCache(UUID companyId) {
//        companyNameCache.remove(companyId);
//    }

    // With company details
    private JobResponse mapToResponse(Job job, boolean includeCompany) {
        if (job == null) {
            throw new BusinessException("Job cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Safely calculate hours ago
        long hoursAgo = calculateHoursAgo(job.getCreatedAt());

        // Get company details
        CompanyDetailsResponse company = null;
        if (includeCompany) {
            company = getCompany(job.getCompanyId());
        }

        // Parse matching criteria from JSON
        Job.MatchingCriteria matchingCriteria = null;
        if (job.getMatchingCriteria() != null && !job.getMatchingCriteria().isEmpty()) {
            try {
                matchingCriteria = objectMapper.readValue(job.getMatchingCriteria(),
                        Job.MatchingCriteria.class);
            } catch (Exception e) {
                log.warn("Failed to parse matching criteria for job: {}", job.getId());
            }
        }

        // Get presigned URL for description image if file key exists
        String descriptionImageUrl = null;
        if (job.getDescriptionImageUrl() != null && !job.getDescriptionImageUrl().isEmpty()) {
            descriptionImageUrl = getPresignedUrlFromFileService(job.getDescriptionImageUrl());
        }

        return JobResponse.builder()
                .id(job.getId())
                .companyId(job.getCompanyId())
                .companyName("")
                .jobTitle(job.getJobTitle())
                .category(job.getCategory())
                .location(job.getLocation())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .salaryNegotiable(job.getSalaryNegotiable())
                .educationLevel(job.getEducationLevel())
                .minExperience(job.getMinExperience())
                .employmentType(job.getEmploymentType())
                .fieldOfStudy(job.getFieldOfStudy())
                .minAge(job.getMinAge())
                .maxAge(job.getMaxAge())
                .jobDescription(job.getJobDescription())
//                .workingHours(job.getWorkingHours())
                .startTime(job.getWorkingHoursStart())
                .endTime(job.getWorkingHoursEnd())
                .benefits(job.getBenefits())
                .applicationDeadline(job.getApplicationDeadline())
                .confirmationEmail(job.getConfirmationEmail())
                .type(job.getType() != null ? job.getType().toString() : null)
                .skills(job.getSkills() != null ? java.util.Arrays.asList(job.getSkills()) : null)
                .descriptionImageFileKey(job.getDescriptionImageUrl())
                .descriptionImageUrl(descriptionImageUrl)
                .cvDeliveryOption(job.getCvDeliveryOption() != null ?
                        job.getCvDeliveryOption().toString() : null)
                .matchingCriteria(matchingCriteria)
                .status(job.getStatus() != null ? job.getStatus().toString() : null)
                .viewCount(job.getViewCount() != null ? job.getViewCount() : 0)
                .applicationCount(job.getApplicationCount() != null ? job.getApplicationCount() : 0)
                .postedHoursAgo(hoursAgo)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .company(company)
                .build();
    }

    // Default - no company details
    private JobResponse mapToResponse(Job job) {
        return mapToResponse(job, false);
    }

    private JobListResponse mapToListResponse(Job job) {
        if (job == null) {
            throw new BusinessException("Job cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Safely calculate hours ago
        long hoursAgo = calculateHoursAgo(job.getCreatedAt());

        return JobListResponse.builder()
                .id(job.getId())
                .companyId(job.getCompanyId())
                .companyName("Company")
                .jobTitle(job.getJobTitle())
                .location(job.getLocation())
                .type(job.getType() != null ? job.getType().toString() : null)
                .employmentType(job.getEmploymentType())
                .category(job.getCategory())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .status(job.getStatus() != null ? job.getStatus().toString() : null)
                .applicationCount(job.getApplicationCount() != null ? job.getApplicationCount() : 0)
                .viewCount(job.getViewCount() != null ? job.getViewCount() : 0)
                .postedHoursAgo(hoursAgo)
                .createdAt(job.getCreatedAt())
                .build();
    }

    private JobAdminListResponse mapToAdminListResponse(Job job, Map<UUID, CompanyDetailsResponse> companyDetailsMap) {
        if (job == null) {
            throw new BusinessException("Job cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get company details from the map
        CompanyDetailsResponse company = null;
        String companyName = "Company";

        if (companyDetailsMap != null && companyDetailsMap.containsKey(job.getCompanyId())) {
            company = companyDetailsMap.get(job.getCompanyId());
            if (company != null && company.getCompanyName() != null) {
                companyName = company.getCompanyName();
            }
        }

        // Safely calculate hours ago
        long hoursAgo = calculateHoursAgo(job.getCreatedAt());

        return JobAdminListResponse.builder()
                .id(job.getId())
                .companyId(job.getCompanyId())
                .companyName(companyName)
                .logoUrl(company.getLogoUrl())
                .jobTitle(job.getJobTitle())
                .jobType(job.getType() != null ? job.getType().toString() : null)
                .location(job.getLocation())
                .status(job.getStatus() != null ? job.getStatus().toString() : null)
                .applications(job.getApplicationCount() != null ? job.getApplicationCount() : 0)
                .views(job.getViewCount() != null ? job.getViewCount() : 0)
                .createdAt(job.getCreatedAt())
                .build();
    }

    private JobPublicListResponse mapToPublicListResponse(Job job, Map<UUID, CompanyDetailsResponse> companyDetailsMap) {
        if (job == null) {
            throw new BusinessException("Job cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get company details from the map
        CompanyDetailsResponse company = null;
        String companyName = "Company";
        String companyLogo = null;

        if (companyDetailsMap != null && companyDetailsMap.containsKey(job.getCompanyId())) {
            company = companyDetailsMap.get(job.getCompanyId());
            if (company != null && company.getCompanyName() != null) {
                companyName = company.getCompanyName();
                companyLogo = company.getLogoUrl();
            }
        }

        // Safely calculate hours ago
        long hoursAgo = calculateHoursAgo(job.getCreatedAt());

        return JobPublicListResponse.builder()
                .id(job.getId())
                .companyId(job.getCompanyId())
                .companyName(companyName)
                .logoUrl(companyLogo)
                .jobTitle(job.getJobTitle())
                .category(job.getCategory() != null ? job.getCategory().toString() : null)
                .location(job.getLocation())
                .employmentType(job.getEmploymentType() != null ? job.getEmploymentType().toString() : null)
                .status(job.getStatus() != null ? job.getStatus().toString() : null)
                .type(job.getType() != null ? job.getType().toString() : null)
                .minSalary(job.getSalaryMin())
                .maxSalary(job.getSalaryMax())
                .applications(job.getApplicationCount() != null ? job.getApplicationCount() : 0)
                .views(job.getViewCount() != null ? job.getViewCount() : 0)
                .createdAt(job.getCreatedAt())
                .build();
    }

}