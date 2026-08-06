package com.godayana.course.service.impl;

import com.godayana.course.dto.response.*;
import com.godayana.dto.ApiResponse;
import com.godayana.dto.ApiResponseWrapper;
import com.godayana.dto.FileUploadResponse;
import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.course.dto.request.CourseRequest;
import com.godayana.course.entity.Course;
import com.godayana.course.repository.CourseRepository;
import com.godayana.course.service.interfaces.ICourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
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
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseServiceImpl implements ICourseService {

    private final CourseRepository courseRepository;

    private final WebClient.Builder webClientBuilder;

    @Value("${FILE_SERVICE_URL}")
    private String fileServiceUrl;

    @Value("${USER_SERVICE_URL}")
    private String userServiceUrl;

    @Override
    @Transactional
    public CourseResponse createCourse(UUID companyId, CourseRequest request) {
        log.info("Creating course for company: {}", companyId);

        Course.CourseStatus status = Course.CourseStatus.PENDING;
        if ("draft".equalsIgnoreCase(request.getStatus())) {
            status = Course.CourseStatus.DRAFT;
        }

        Course course = Course.builder()
                .companyId(companyId)
                .title(request.getTitle())
                .category(request.getCategory())
                .categoryLabel(request.getCategoryLabel())
                .description(request.getDescription())
                .enrollType(Course.EnrollType.valueOf(request.getEnrollType()))
                .location(request.getLocation())
                .instructor(request.getInstructor())
                .instructorBio(request.getInstructorBio())
                .instructorAvatar(request.getInstructorAvatar())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .duration(request.getDuration())
                .schedule(request.getSchedule())
                .price(request.getPrice())
                .maxStudents(request.getMaxStudents())
                .enrolledStudents(request.getEnrolledStudents() != null ? request.getEnrolledStudents() : 0)
                .rating(request.getRating())
                .requirementLevel(request.getRequirementLevel())
                .migrationPaths(request.getMigrationPaths() != null ? request.getMigrationPaths().toArray(new String[0]) : null)
                .benefits(request.getBenefits() != null ? request.getBenefits().toArray(new String[0]) : null)
                .requirements(request.getRequirements() != null ? request.getRequirements().toArray(new String[0]) : null)
                .lessons(request.getLessons() != null ? request.getLessons().toArray(new String[0]) : null)
                .learningOutcomes(request.getLearningOutcomes() != null ? request.getLearningOutcomes().toArray(new String[0]) : null)
                .includes(request.getIncludes() != null ? request.getIncludes().toArray(new String[0]) : null)
                .targetAudience(request.getTargetAudience() != null ? request.getTargetAudience().toArray(new String[0]) : null)
                .certificate(request.getCertificate() != null ? request.getCertificate() : false)
                .certificateType(request.getCertificateType())
                .courseImageFileKey(request.getCourseImageFileKey())
                .courseImageUrl(null) // Will be set when retrieving
                .confirmationEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .curriculum(request.getCurriculum())
//                .status(Course.CourseStatus.PENDING)
                .status(status)
                .viewCount(0)
                .enrollmentCount(0)
                .createdBy(companyId)
                .build();

        course = courseRepository.save(course);
        log.info("Course created with ID: {}", course.getId());

        return mapToResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(UUID courseId, UUID companyId, CourseRequest request) {
        log.info("Updating course: {} for company: {}", courseId, companyId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getCompanyId().equals(companyId)) {
            throw new BusinessException("You don't have permission to update this course",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        if (
//                course.getStatus() == Course.CourseStatus.APPROVED ||
                course.getStatus() == Course.CourseStatus.REJECTED ||
                course.getStatus() == Course.CourseStatus.CLOSED
        ) {
            throw new BusinessException("Cannot edit an approved or closed course",
                    ErrorCode.BUSINESS_ERROR.getCode(), 400);
        }

        course.setTitle(request.getTitle());
        course.setCategory(request.getCategory());
        course.setCategoryLabel(request.getCategoryLabel());
        course.setDescription(request.getDescription());
        course.setEnrollType(Course.EnrollType.valueOf(request.getEnrollType()));
        course.setLocation(request.getLocation());
        course.setInstructor(request.getInstructor());
        course.setInstructorBio(request.getInstructorBio());
        course.setInstructorAvatar(request.getInstructorAvatar());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setDuration(request.getDuration());
        course.setSchedule(request.getSchedule());
        course.setPrice(request.getPrice());
        course.setMaxStudents(request.getMaxStudents());
        course.setEnrolledStudents(request.getEnrolledStudents() != null ? request.getEnrolledStudents() : 0);
        course.setRating(request.getRating());
        course.setRequirementLevel(request.getRequirementLevel());
        course.setMigrationPaths(request.getMigrationPaths() != null ? request.getMigrationPaths().toArray(new String[0]) : null);
        course.setBenefits(request.getBenefits() != null ? request.getBenefits().toArray(new String[0]) : null);
        course.setRequirements(request.getRequirements() != null ? request.getRequirements().toArray(new String[0]) : null);
        course.setLessons(request.getLessons() != null ? request.getLessons().toArray(new String[0]) : null);
        course.setLearningOutcomes(request.getLearningOutcomes() != null ? request.getLearningOutcomes().toArray(new String[0]) : null);
        course.setIncludes(request.getIncludes() != null ? request.getIncludes().toArray(new String[0]) : null);
        course.setTargetAudience(request.getTargetAudience() != null ? request.getTargetAudience().toArray(new String[0]) : null);
        course.setCertificate(request.getCertificate() != null ? request.getCertificate() : false);
        course.setCertificateType(request.getCertificateType());
        course.setCourseImageFileKey(request.getCourseImageFileKey());
        course.setConfirmationEmail(request.getContactEmail());
        course.setContactPhone(request.getContactPhone());
        course.setCurriculum(request.getCurriculum());

        course = courseRepository.save(course);
        return mapToResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse getCourseById(UUID courseId, Boolean isVisited) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        if (isVisited != null && !isVisited) {
            incrementViewCount(courseId);
        }
        return mapToResponse(course, true);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getCompanyCourseById(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        return mapToResponse(course, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseListResponse> getAllCourses(String search, String category, String enrollType,
                                                  String location, String status, Pageable pageable) {
        String effectiveStatus = status != null ? status : "APPROVED";
        return courseRepository.searchCourses(search, category, enrollType, location, effectiveStatus, pageable)
                .map(this::mapToListResponse);
    }

    @Override
    public Page<CoursePublicListResponse> getPublicCourses(String keyword, String migrationPath, String category, String requirementLevel, Pageable pageable) {
        String effectiveStatus = "APPROVED";

        Page<Course> coursePage = courseRepository.searchPublicCoursesNative(keyword, migrationPath, category, requirementLevel, effectiveStatus, pageable);

        // Get all company IDs from the jobs
        List<UUID> companyIds = coursePage.getContent().stream()
                .map(Course::getCompanyId)
                .distinct()
                .toList();

        // Batch fetch company details
        Map<UUID, CompanyDetailsResponse> companyDetailsMap = getCompanyDetailsBatch(companyIds);

        // Map to admin list response with company details
        return coursePage.map(job -> mapToPublicListResponse(job, companyDetailsMap));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseAdminListResponse> getAdminAllCourses(String search, String category, String enrollType,
                                                            String location, String status, Pageable pageable) {
        String effectiveStatus = status != null ? status : "APPROVED";
//        return courseRepository.searchCoursesNative(search, category, enrollType, location, effectiveStatus, pageable)
//                .map(this::mapToAdminListResponse);

        Page<Course> coursePage = courseRepository.searchCoursesNative(search, category, enrollType, location, effectiveStatus, pageable);

        // Get all company IDs from the courses
        List<UUID> companyIds = coursePage.getContent().stream()
                .map(Course::getCompanyId)
                .distinct()
                .toList();

        // Batch fetch company details
        Map<UUID, CompanyDetailsResponse> companyDetailsMap = getCompanyDetailsBatch(companyIds);

        // Map to admin list response with company details
        return coursePage.map(course -> mapToAdminListResponse(course, companyDetailsMap));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseListResponse> getCoursesByCompany(UUID companyId, String status, Pageable pageable) {
        if (status == null || status.isEmpty()) {
            return courseRepository.findByCompanyId(companyId, pageable)
                    .map(this::mapToListResponse);
        } else if (status.equalsIgnoreCase("closed")) {
            return courseRepository.findByCompanyIdAndStatusIn(
                    companyId,
                    List.of(Course.CourseStatus.CLOSED, Course.CourseStatus.REJECTED),
                    pageable
            ).map(this::mapToListResponse);
        } else {
            return courseRepository.findByCompanyIdAndStatus(companyId, Course.CourseStatus.valueOf(status), pageable)
                    .map(this::mapToListResponse);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseListResponse> getPendingCourses(Pageable pageable) {
        return courseRepository.findByStatus(Course.CourseStatus.PENDING, pageable)
                .map(this::mapToListResponse);
    }

    @Override
    @Transactional
    public void approveCourse(UUID courseId, UUID adminId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!(course.getStatus() == Course.CourseStatus.PENDING | course.getStatus() == Course.CourseStatus.REJECTED)) {
            throw new BusinessException("Course is not in pending or reject state",
                    ErrorCode.INVALID_STATUS_TRANSITION.getCode(), 400);
        }

        course.setStatus(Course.CourseStatus.APPROVED);
        course.setApprovedBy(adminId);
        course.setApprovedAt(LocalDateTime.now());
        course = courseRepository.save(course);

//        return mapToResponse(course);
    }

    @Override
    @Transactional
    public void rejectCourse(UUID courseId, UUID adminId, String reason) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!(course.getStatus() == Course.CourseStatus.PENDING | course.getStatus() == Course.CourseStatus.APPROVED)) {
            throw new BusinessException("Course is not in pending or approved state",
                    ErrorCode.INVALID_STATUS_TRANSITION.getCode(), 400);
        }

        course.setStatus(Course.CourseStatus.REJECTED);
        course.setApprovedBy(adminId);
        course.setApprovedAt(LocalDateTime.now());
        course = courseRepository.save(course);

//        return mapToResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse closeCourse(UUID courseId, UUID userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getCompanyId().equals(userId)) {
            throw new BusinessException("You don't have permission to close this course",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        course.setStatus(Course.CourseStatus.CLOSED);
        course = courseRepository.save(course);

        return mapToResponse(course);
    }

    @Override
    @Transactional
    public void deleteCourse(UUID courseId, UUID userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getCompanyId().equals(userId)) {
            throw new BusinessException("You don't have permission to delete this course",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        courseRepository.delete(course);
    }

    @Override
    @Transactional
    public void incrementViewCount(UUID courseId) {
        courseRepository.incrementViewCount(courseId);
    }

    @Override
    @Transactional
    public void incrementEnrollmentCount(UUID courseId) {
        courseRepository.incrementEnrollmentCount(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseCountsResponse getCompanyCourseCounts(UUID companyId) {
        log.debug("Getting course counts for company: {}", companyId);

        long total = courseRepository.countByCompanyId(companyId);
        long pending = courseRepository.countByCompanyIdAndStatus(companyId, Course.CourseStatus.PENDING);
        long approved = courseRepository.countByCompanyIdAndStatus(companyId, Course.CourseStatus.APPROVED);
        long rejected = courseRepository.countByCompanyIdAndStatus(companyId, Course.CourseStatus.REJECTED);
        long closed = courseRepository.countByCompanyIdAndStatus(companyId, Course.CourseStatus.CLOSED);
        long draft = courseRepository.countByCompanyIdAndStatus(companyId, Course.CourseStatus.DRAFT);

        return CourseCountsResponse.builder()
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
    public CourseCountsResponse getAdminCourseCounts() {
        log.debug("Getting course counts for admin");

        long total = courseRepository.count();
        long pending = courseRepository.countByStatus(Course.CourseStatus.PENDING);
        long approved = courseRepository.countByStatus(Course.CourseStatus.APPROVED);
        long rejected = courseRepository.countByStatus(Course.CourseStatus.REJECTED);
        long closed = courseRepository.countByStatus(Course.CourseStatus.CLOSED);
        long draft = courseRepository.countByStatus(Course.CourseStatus.DRAFT);

        return CourseCountsResponse.builder()
                .all(total)
                .pending(pending)
                .approved(approved)
                .rejected(rejected)
                .closed(closed)
                .draft(draft)
                .build();
    }


    private long calculateHoursAgo(LocalDateTime createdAt) {
        if (createdAt == null) return 0L;
        try {
            return ChronoUnit.HOURS.between(createdAt, LocalDateTime.now());
        } catch (Exception e) {
            return 0L;
        }
    }

    @Override
    @Transactional
    public CourseImageUploadResponse uploadCourseImage(UUID companyId, MultipartFile file) {
        log.info("Uploading course image for company: {}", companyId);

        try {
            return uploadCourseImageToFileService(file, "company-course-image", companyId.toString());

        } catch (Exception e) {
            throw new BusinessException(
                    "Failed to upload course image: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private CourseImageUploadResponse uploadCourseImageToFileService(MultipartFile file, String folder, String userId) {
        try {
            MultiValueMap<String, Object> multipartBody = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            multipartBody.add("file", resource);

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

            log.info("File uploaded successfully. FileKey: {}, FileUrl: {}", fileKey, fileUrl);

            if (fileKey == null || fileKey.isEmpty()) {
                throw new BusinessException(
                        "File key not found in response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            return CourseImageUploadResponse.builder()
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

    private CompanyDetailsResponse getCompany(UUID companyId) {
        if (companyId == null) {
            return null;
        }

        try {
            ApiResponse<CompanyDetailsResponse> response = webClientBuilder.build()
                    .get()
                    .uri(userServiceUrl + "/api/v1/company/profiles/internal/{companyId}", companyId)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<CompanyDetailsResponse>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                CompanyDetailsResponse company = response.getData();
                log.debug("Fetched company details for ID: {}, Name: {}", companyId, company.getCompanyName());
                return company;
            }

            log.warn("Failed to get company for ID: {}", companyId);
            return null;

        } catch (Exception e) {
            log.error("Error fetching company name for ID: {}", companyId, e);
            return null;
        }
    }

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

    private CourseResponse mapToResponse(Course course, boolean includeCompany) {
        if (course == null) {
            throw new BusinessException("Course cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        long hoursAgo = calculateHoursAgo(course.getCreatedAt());

        CompanyDetailsResponse company = null;
        if (includeCompany) {
            company = getCompany(course.getCompanyId());
        }

        // Get presigned URL for course image if file key exists
        String courseImageUrl = null;
        if (course.getCourseImageFileKey() != null && !course.getCourseImageFileKey().isEmpty()) {
            courseImageUrl = getPresignedUrlFromFileService(course.getCourseImageFileKey());
        }

        return CourseResponse.builder()
                .id(course.getId())
                .companyId(course.getCompanyId())
                .companyName(company != null ? company.getCompanyName() : null)
                .title(course.getTitle())
                .category(course.getCategory())
                .categoryLabel(course.getCategoryLabel())
                .description(course.getDescription())
                .enrollType(course.getEnrollType() != null ? course.getEnrollType().toString() : null)
                .location(course.getLocation())
                .instructor(course.getInstructor())
                .instructorBio(course.getInstructorBio())
                .instructorAvatar(course.getInstructorAvatar())
                .startDate(course.getStartDate())
                .endDate(course.getEndDate())
                .duration(course.getDuration())
                .schedule(course.getSchedule())
                .price(course.getPrice())
                .maxStudents(course.getMaxStudents())
                .enrolledStudents(course.getEnrolledStudents())
                .rating(course.getRating())
                .requirementLevel(course.getRequirementLevel())
                .migrationPaths(course.getMigrationPaths() != null ? Arrays.asList(course.getMigrationPaths()) : null)
                .benefits(course.getBenefits() != null ? Arrays.asList(course.getBenefits()) : null)
                .requirements(course.getRequirements() != null ? Arrays.asList(course.getRequirements()) : null)
                .lessons(course.getLessons() != null ? Arrays.asList(course.getLessons()) : null)
                .learningOutcomes(course.getLearningOutcomes() != null ? Arrays.asList(course.getLearningOutcomes()) : null)
                .includes(course.getIncludes() != null ? Arrays.asList(course.getIncludes()) : null)
                .targetAudience(course.getTargetAudience() != null ? Arrays.asList(course.getTargetAudience()) : null)
                .certificate(course.getCertificate())
                .certificateType(course.getCertificateType())
                .courseImageUrl(courseImageUrl)
                .courseImageFileKey(course.getCourseImageFileKey())
                .contactEmail(course.getConfirmationEmail())
                .contactPhone(course.getContactPhone())
                .curriculum(course.getCurriculum())
                .status(course.getStatus() != null ? course.getStatus().toString() : null)
                .viewCount(course.getViewCount() != null ? course.getViewCount() : 0)
                .enrollmentCount(course.getEnrollmentCount() != null ? course.getEnrollmentCount() : 0)
                .postedHoursAgo(hoursAgo)
                .postedDate(course.getCreatedAt())
                .lastUpdated(course.getUpdatedAt())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .isEnrolled(false) // This should be set based on user's enrollment status
                .isSaved(false) // This should be set based on user's saved status
                .company(company)
                .build();
    }

    private CourseResponse mapToResponse(Course course) {
        return mapToResponse(course, false);
    }

    private CourseListResponse mapToListResponse(Course course) {
        long hoursAgo = calculateHoursAgo(course.getCreatedAt());

        return CourseListResponse.builder()
                .id(course.getId())
                .companyId(course.getCompanyId())
                .title(course.getTitle())
                .category(course.getCategory())
//                .categoryLabel(course.getCategoryLabel())
                .enrollType(course.getEnrollType() != null ? course.getEnrollType().toString() : null)
                .location(course.getLocation())
//                .instructor(course.getInstructor())
                .price(course.getPrice())
//                .maxStudents(course.getMaxStudents())
//                .enrolledStudents(course.getEnrolledStudents())
//                .rating(course.getRating())
                .status(course.getStatus() != null ? course.getStatus().toString() : null)
                .enrollmentCount(course.getEnrollmentCount() != null ? course.getEnrollmentCount() : 0)
                .viewCount(course.getViewCount() != null ? course.getViewCount() : 0)
                .postedHoursAgo(hoursAgo)
                .createdAt(course.getCreatedAt())
//                .updatedAt(course.getUpdatedAt())
                .build();
    }

    private CourseAdminListResponse mapToAdminListResponse(Course course, Map<UUID, CompanyDetailsResponse> companyDetailsMap) {
        if (course == null) {
            throw new BusinessException("Course cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get company details from the map
        CompanyDetailsResponse company = null;
        String companyName = "Company";
        String logoUrl = null;

        if (companyDetailsMap != null && companyDetailsMap.containsKey(course.getCompanyId())) {
            company = companyDetailsMap.get(course.getCompanyId());
            if (company != null && company.getCompanyName() != null) {
                companyName = company.getCompanyName();
                logoUrl = company.getLogoUrl();
            }
        }

        return CourseAdminListResponse.builder()
                .id(course.getId())
                .companyId(course.getCompanyId())
                .companyName(companyName)
//                .company(company)  // Include full company details
                .logoUrl(logoUrl)
                .courseTitle(course.getTitle())
                .enrollType(course.getEnrollType() != null ? course.getEnrollType().toString() : null)
                .location(course.getLocation())
                .price(course.getPrice())
                .maxStudents(course.getMaxStudents())
                .enrolledStudents(course.getEnrolledStudents())
                .status(course.getStatus() != null ? course.getStatus().toString() : null)
                .views(course.getViewCount() != null ? course.getViewCount() : 0)
                .createdAt(course.getCreatedAt())
                .build();
    }

    private CoursePublicListResponse mapToPublicListResponse(Course course, Map<UUID, CompanyDetailsResponse> companyDetailsMap) {
        if (course == null) {
            throw new BusinessException("course cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get company details from the map
        CompanyDetailsResponse company = null;
        String companyName = "Company";
        String companyLogo = null;

        if (companyDetailsMap != null && companyDetailsMap.containsKey(course.getCompanyId())) {
            company = companyDetailsMap.get(course.getCompanyId());
            if (company != null && company.getCompanyName() != null) {
                companyName = company.getCompanyName();
                companyLogo = company.getLogoUrl();
            }
        }

        // Safely calculate hours ago
//        long hoursAgo = calculateHoursAgo(course.getCreatedAt());

        return CoursePublicListResponse.builder()
                .id(course.getId())
                .companyId(course.getCompanyId())
                .companyName(companyName)
                .logoUrl(companyLogo)
                .courseTitle(course.getTitle())
                .category(course.getCategory())
                .location(course.getLocation())
                .status(course.getStatus() != null ? course.getStatus().toString() : null)
                .courseLevel(course.getRating().intValue())
                .price(course.getPrice())
                .enrollType(course.getEnrollType() != null ? course.getEnrollType().toString() : null)
                .viewCount(course.getViewCount() != null ? course.getViewCount() : 0)
                .enrollmentCount(course.getEnrollmentCount() != null ? course.getEnrollmentCount() : 0)
                .migrationPaths(course.getMigrationPaths())
                .duration(course.getDuration())
                .startDate(course.getStartDate().toString())
                .requirementLevel(course.getRequirementLevel())
                .createdAt(course.getCreatedAt())
                .build();
    }


}