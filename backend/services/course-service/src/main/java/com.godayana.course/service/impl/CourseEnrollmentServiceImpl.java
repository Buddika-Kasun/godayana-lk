package com.godayana.course.service.impl;

import com.godayana.course.dto.CourseEnrollmentSummary;
import com.godayana.course.dto.response.CourseEnrollmentCompanyResponse;
import com.godayana.course.dto.response.CourseEnrollmentCountsResponse;
import com.godayana.course.dto.response.CourseEnrollmentResponse;
import com.godayana.course.dto.response.CourseEnrollmentSeekerResponse;
import com.godayana.course.entity.Course;
import com.godayana.course.entity.CourseEnrollment;
import com.godayana.course.repository.CourseEnrollmentRepository;
import com.godayana.course.repository.CourseRepository;
import com.godayana.course.repository.CourseSaveRepository;
import com.godayana.course.service.interfaces.ICourseEnrollmentService;
import com.godayana.dto.ApiResponse;
import com.godayana.dto.company.CompanyDetailsResponse;
import com.godayana.dto.seeker.SeekerDetailsResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
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
public class CourseEnrollmentServiceImpl implements ICourseEnrollmentService {

    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final CourseRepository courseRepository;
    private final CourseSaveRepository courseSaveRepository;

    private final WebClient.Builder webClientBuilder;

    @Value("${USER_SERVICE_URL}")
    private String userServiceUrl;

    @Override
    @Transactional
    public CourseEnrollmentResponse enrollInCourse(UUID seekerId, UUID courseId) {
        log.info("Enrolling in course: {} by seeker: {}", courseId, seekerId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (course.getStatus() != Course.CourseStatus.APPROVED) {
            throw new BusinessException("Course is not open for enrollment",
                    ErrorCode.BUSINESS_ERROR.getCode(), 400);
        }

        if (courseEnrollmentRepository.existsBySeekerIdAndCourseId(seekerId, courseId)) {
            throw new BusinessException("You have already enrolled in this course",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(), 409);
        }

        CourseEnrollment enrollment = CourseEnrollment.builder()
                .courseId(courseId)
                .seekerId(seekerId)
                .status(CourseEnrollment.EnrollmentStatus.PENDING)
                .createdBy(seekerId)
                .build();

        enrollment = courseEnrollmentRepository.save(enrollment);
        courseRepository.incrementEnrollmentCount(courseId);

        return mapToResponse(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseEnrollmentCompanyResponse> getEnrollmentsByCourse(UUID courseId, UUID companyId, String status, Pageable pageable) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getCompanyId().equals(companyId)) {
            throw new BusinessException("You don't have permission to view these enrollments",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        Page<CourseEnrollmentSummary> courseEnrollments;
        if (status.equalsIgnoreCase("rejected")) {
            courseEnrollments = courseEnrollmentRepository.findSummariesByCourseIdAndStatus(
                    courseId,
                    List.of(
                            CourseEnrollment.EnrollmentStatus.CANCELLED
                    ),
                    pageable
            );
        }
        else {
            courseEnrollments = courseEnrollmentRepository.findSummariesByCourseIdAndStatus(
                    courseId,
                    List.of(
                            CourseEnrollment.EnrollmentStatus.valueOf(status)
                    ),
                    pageable
            );
        }

        // Get all seeker IDs from the enrollments
        List<UUID> seekerIds = courseEnrollments.getContent().stream()
                .map(CourseEnrollmentSummary::getSeekerId)
                .distinct()
                .toList();

        // Batch fetch seeker details
        Map<UUID, SeekerDetailsResponse> seekerDetailsMap = getSeekerDetailsBatch(seekerIds);

        // Map to company list response with seeker details
        return courseEnrollments.map(enrollment -> mapToCompanyListResponse(
                enrollment,
                seekerDetailsMap
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public CourseEnrollmentCountsResponse countEnrollmentsByCourse(UUID courseId) {
        String courseTitle = courseRepository.findCourseNameById(courseId);
        long total = courseEnrollmentRepository.countByCourseId(courseId);
        long pending = courseEnrollmentRepository.countByCourseIdAndStatus(courseId, CourseEnrollment.EnrollmentStatus.PENDING);
        long enrolled = courseEnrollmentRepository.countByCourseIdAndStatus(courseId, CourseEnrollment.EnrollmentStatus.ENROLLED);
        long cancelled = courseEnrollmentRepository.countByCourseIdAndStatus(courseId, CourseEnrollment.EnrollmentStatus.CANCELLED);

        return CourseEnrollmentCountsResponse.builder()
                .courseTitle(courseTitle)
                .all(total)
                .pending(pending)
                .enrolled(enrolled)
                .rejected(cancelled)
                .build();
    }

    @Override
    public CourseEnrollmentCountsResponse countEnrollmentsBySeeker(UUID seekerId) {
        long total = courseEnrollmentRepository.countBySeekerId(seekerId);
        long pending = courseEnrollmentRepository.countBySeekerIdAndStatus(seekerId, CourseEnrollment.EnrollmentStatus.PENDING);
        long enrolled = courseEnrollmentRepository.countBySeekerIdAndStatus(seekerId, CourseEnrollment.EnrollmentStatus.ENROLLED);
        long cancelled = courseEnrollmentRepository.countBySeekerIdAndStatus(seekerId, CourseEnrollment.EnrollmentStatus.CANCELLED);

        return CourseEnrollmentCountsResponse.builder()
                .all(total)
                .pending(pending)
                .enrolled(enrolled)
                .rejected(cancelled)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseEnrollmentSeekerResponse> getEnrollmentsBySeekerAndStatus(UUID seekerId, String status, Pageable pageable) {
        Page<CourseEnrollmentSummary> courseEnrollments;
        if (status.equalsIgnoreCase("active")) {
            courseEnrollments = courseEnrollmentRepository.findSummariesBySeekerIdAndStatuses(
                    seekerId,
                    List.of(
                            CourseEnrollment.EnrollmentStatus.ENROLLED
                    ),
                    pageable
            );
        }
        else if (status.equalsIgnoreCase("rejected")) {
            courseEnrollments = courseEnrollmentRepository.findSummariesBySeekerIdAndStatuses(
                    seekerId,
                    List.of(
                            CourseEnrollment.EnrollmentStatus.CANCELLED
                    ),
                    pageable
            );
        }
        else if (status.equalsIgnoreCase("saved")) {
            courseEnrollments = courseSaveRepository.findSaveSummariesBySeekerIdAndStatuses(
                    seekerId,
                    pageable
            );
        }
        else {
            courseEnrollments = courseEnrollmentRepository.findSummariesBySeekerIdAndStatuses(
                    seekerId,
                    List.of(CourseEnrollment.EnrollmentStatus.valueOf(status)),
                    pageable
            );
        }

        // Get all company IDs from the courses
        List<UUID> companyIds = courseEnrollments.getContent().stream()
                .map(CourseEnrollmentSummary::getCompanyId)
                .distinct()
                .toList();

        // Batch fetch company details
        Map<UUID, CompanyDetailsResponse> companyDetailsMap = getCompanyDetailsBatch(companyIds);

        // Map to seeker list response with company details
        return courseEnrollments.map(enrollment -> mapToSeekerListResponse(
                enrollment,
                companyDetailsMap
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UUID> getEnrollmentIdsBySeeker(UUID seekerId, Pageable pageable) {
        return courseEnrollmentRepository.findEnrollmentIdsBySeekerId(seekerId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseEnrollmentResponse getEnrollmentById(UUID enrollmentId) {
        CourseEnrollment enrollment = courseEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", enrollmentId));
        return mapToResponse(enrollment);
    }

    @Override
    @Transactional
    public CourseEnrollmentResponse updateEnrollmentStatus(UUID enrollmentId, UUID companyId, String status) {
        CourseEnrollment enrollment = courseEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", enrollmentId));

        CourseEnrollment finalEnrollment = enrollment;
        Course course = courseRepository.findById(enrollment.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", finalEnrollment.getCourseId()));

        if (!course.getCompanyId().equals(companyId)) {
            throw new BusinessException("You don't have permission to update this enrollment",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        enrollment.setStatus(CourseEnrollment.EnrollmentStatus.valueOf(status));
        enrollment = courseEnrollmentRepository.save(enrollment);

        return mapToResponse(enrollment);
    }

    @Override
    @Transactional
    public void withdrawEnrollment(UUID enrollmentId, UUID seekerId) {
        CourseEnrollment enrollment = courseEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", enrollmentId));

        if (!enrollment.getSeekerId().equals(seekerId)) {
            throw new BusinessException("You don't have permission to withdraw this enrollment",
                    ErrorCode.UNAUTHORIZED.getCode(), 403);
        }

        courseEnrollmentRepository.delete(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isEnrolled(UUID seekerId, UUID courseId) {
        return courseEnrollmentRepository.existsBySeekerIdAndCourseId(seekerId, courseId);
    }

//    @Override
//    @Transactional(readOnly = true)
//    public long countEnrollmentsByCourse(UUID courseId) {
//        return courseEnrollmentRepository.countByCourseId(courseId);
//    }

    @Override
    @Transactional(readOnly = true)
    public long countEnrollmentsByCourseAndStatus(UUID courseId, String status) {
        return courseEnrollmentRepository.countByCourseIdAndStatus(courseId,
                CourseEnrollment.EnrollmentStatus.valueOf(status));
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
     * Batch fetch seeker details for multiple seekers
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

    private CourseEnrollmentResponse mapToResponse(CourseEnrollment enrollment) {
        return CourseEnrollmentResponse.builder()
                .id(enrollment.getId())
                .courseId(enrollment.getCourseId())
                .seekerId(enrollment.getSeekerId())
                .status(enrollment.getStatus() != null ? enrollment.getStatus().toString() : null)
                .appliedAt(enrollment.getEnrolledAt())
                .updatedAt(enrollment.getUpdatedAt())
                .build();
    }

    private CourseEnrollmentSeekerResponse mapToSeekerListResponse(
            CourseEnrollmentSummary enrollment,
            Map<UUID, CompanyDetailsResponse> companyDetailsMap
    ) {
        if (enrollment == null) {
            throw new BusinessException("Course enrollment cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get company details from the map
        CompanyDetailsResponse company = null;
        String companyName = "Company";
        String logoUrl = "";

        if (companyDetailsMap != null && companyDetailsMap.containsKey(enrollment.getCompanyId())) {
            company = companyDetailsMap.get(enrollment.getCompanyId());
            if (company != null && company.getCompanyName() != null) {
                companyName = company.getCompanyName();
                logoUrl = company.getLogoUrl();
            }
        }

        return CourseEnrollmentSeekerResponse.builder()
                .id(enrollment.getId())
                .courseId(enrollment.getCourseId())
                .courseTitle(enrollment.getCourseTitle())
                .companyName(companyName)
                .logoUrl(logoUrl)
                .location(enrollment.getLocation())
                .status(enrollment.getStatus() != null ? enrollment.getStatus().toString() : null)
                .appliedAt(enrollment.getEnrolledAt())
                .savedAt(enrollment.getSavedAt())
                .build();
    }

    private CourseEnrollmentCompanyResponse mapToCompanyListResponse(
            CourseEnrollmentSummary enrollment,
            Map<UUID, SeekerDetailsResponse> seekerDetailsMap
    ) {
        if (enrollment == null) {
            throw new BusinessException("Course enrollment cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get seeker details from the map
        SeekerDetailsResponse seeker = null;
        String seekerName = "Seeker";
        String seekerEmail = "";
        String seekerProfileUrl = "";
        String seekerCvUrl = "";
        String seekerContactNo = "";
        String seekerGender = "";
        String seekerEducation = "";
        String seekerStudyField = "";

        if (seekerDetailsMap != null && seekerDetailsMap.containsKey(enrollment.getSeekerId())) {
            seeker = seekerDetailsMap.get(enrollment.getSeekerId());
            if (seeker != null) {
                seekerName = seeker.getFullName() != null ? seeker.getFullName() : "Seeker";
                seekerEmail = seeker.getEmail() != null ? seeker.getEmail() : "";
                seekerProfileUrl = seeker.getProfileUrl() != null ? seeker.getProfileUrl() : "";
                seekerCvUrl = seeker.getCvUrl() != null ? seeker.getCvUrl() : "";
                seekerContactNo = seeker.getContactNo() != null ? seeker.getContactNo() : "";
                seekerGender = seeker.getGender() != null ? seeker.getGender() : "";
                seekerEducation = seeker.getEducation() != null ? seeker.getEducation() : "";
                seekerStudyField = seeker.getStudyField() != null ? seeker.getStudyField() : "";
            }
        }

        return CourseEnrollmentCompanyResponse.builder()
                .id(enrollment.getId())
                .seekerId(enrollment.getSeekerId())
                .seekerName(seekerName)
                .seekerEmail(seekerEmail)
                .seekerProfileUrl(seekerProfileUrl)
                .seekerCvUrl(seekerCvUrl)
                .seekerContactNo(seekerContactNo)
                .seekerGender(seekerGender)
                .seekerEducation(seekerEducation)
                .seekerStudyField(seekerStudyField)
                .status(enrollment.getStatus() != null ? enrollment.getStatus().toString() : null)
                .appliedAt(enrollment.getEnrolledAt())
                .build();
    }
}