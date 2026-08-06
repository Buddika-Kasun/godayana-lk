package com.godayana.course.controller;

import com.godayana.course.dto.response.CourseEnrollmentCompanyResponse;
import com.godayana.course.dto.response.CourseEnrollmentCountsResponse;
import com.godayana.course.dto.response.CourseEnrollmentResponse;
import com.godayana.course.dto.response.CourseEnrollmentSeekerResponse;
import com.godayana.course.service.interfaces.ICourseEnrollmentService;
import com.godayana.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
@Slf4j
public class CourseEnrollmentController {

    private final ICourseEnrollmentService courseEnrollmentService;

    @PostMapping("/{courseId}")
    public ApiResponse<CourseEnrollmentResponse> enrollInCourse(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID courseId) {
        log.info("Enrolling in course: {} by seeker: {}", courseId, seekerId);
        return ApiResponse.success(courseEnrollmentService.enrollInCourse(UUID.fromString(seekerId), courseId));
    }

    @GetMapping("/course/{courseId}")
    public ApiResponse<Page<CourseEnrollmentCompanyResponse>> getEnrollmentsByCourse(
            @RequestHeader("X-User-Id") String companyId,
            @PathVariable UUID courseId,
            @RequestParam String status,
            Pageable pageable) {
        log.info("Fetching enrollments for course: {} by company: {}", courseId, companyId);
        return ApiResponse.success(courseEnrollmentService.getEnrollmentsByCourse(courseId,
                UUID.fromString(companyId), status, pageable));
    }

    @GetMapping("/count")
    public ApiResponse<CourseEnrollmentCountsResponse> countCourseEnrollments(
            @RequestHeader("X-User-Id") String seekerId
    ) {
        log.info("Counting enrolled courses of seeker: {}", seekerId);
        return ApiResponse.success(courseEnrollmentService.countEnrollmentsBySeeker(
                UUID.fromString(seekerId)));
    }

    @GetMapping("/company/count/{courseId}")
    public ApiResponse<CourseEnrollmentCountsResponse> countCompanyCourseEnrollments(
            @PathVariable String courseId
    ) {
        log.info("Counting enrollments of course: {}", courseId);
        return ApiResponse.success(courseEnrollmentService.countEnrollmentsByCourse(
                UUID.fromString(courseId)));
    }

    @GetMapping("/me")
    public ApiResponse<Page<CourseEnrollmentSeekerResponse>> getMyEnrollments(
            @RequestHeader("X-User-Id") String seekerId,
            @RequestParam String status,
            Pageable pageable) {
        log.info("Fetching enrollments for seeker: {}", seekerId);
        return ApiResponse.success(courseEnrollmentService.getEnrollmentsBySeekerAndStatus(
                UUID.fromString(seekerId), status, pageable));
    }

    @GetMapping("/me/ids")
    public ApiResponse<Page<UUID>> getMyEnrollmentCourseIds(
            @RequestHeader("X-User-Id") String seekerId,
            Pageable pageable) {
        log.info("Fetching enrollment courses for seeker: {}", seekerId);
        return ApiResponse.success(courseEnrollmentService.getEnrollmentIdsBySeeker(
                UUID.fromString(seekerId), pageable));
    }

    @GetMapping("/{enrollmentId}")
    public ApiResponse<CourseEnrollmentResponse> getEnrollmentById(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID enrollmentId) {
        log.info("Fetching enrollment: {} by user: {}", enrollmentId, userId);
        return ApiResponse.success(courseEnrollmentService.getEnrollmentById(enrollmentId));
    }

    @PutMapping("/{enrollmentId}/status")
    public ApiResponse<CourseEnrollmentResponse> updateEnrollmentStatus(
            @RequestHeader("X-User-Id") String companyId,
            @PathVariable UUID enrollmentId,
            @RequestParam String status) {
        log.info("Updating enrollment: {} status to: {} by company: {}",
                enrollmentId, status, companyId);
        return ApiResponse.success(courseEnrollmentService.updateEnrollmentStatus(
                enrollmentId, UUID.fromString(companyId), status));
    }

    @DeleteMapping("/{enrollmentId}")
    public ApiResponse<Void> withdrawEnrollment(
            @RequestHeader("X-User-Id") String seekerId,
            @PathVariable UUID enrollmentId) {
        log.info("Withdrawing enrollment: {} by seeker: {}", enrollmentId, seekerId);
        courseEnrollmentService.withdrawEnrollment(enrollmentId, UUID.fromString(seekerId));
        return ApiResponse.success(null);
    }

    @GetMapping("/check")
    public ApiResponse<Boolean> hasEnrolled(
            @RequestHeader("X-User-Id") String seekerId,
            @RequestParam UUID courseId) {
        log.info("Checking if seeker: {} has enrolled in course: {}", seekerId, courseId);
        return ApiResponse.success(courseEnrollmentService.isEnrolled(
                UUID.fromString(seekerId), courseId));
    }
}