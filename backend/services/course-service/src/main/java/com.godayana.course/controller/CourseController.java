package com.godayana.course.controller;

import com.godayana.course.dto.response.*;
import com.godayana.dto.ApiResponse;
import com.godayana.course.dto.request.CourseRequest;
import com.godayana.course.service.interfaces.ICourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Slf4j
public class CourseController {

    private final ICourseService courseService;

    @PostMapping
    public ApiResponse<CourseResponse> createCourse(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CourseRequest request) {
        log.info("Creating course for user: {}", userId);
        return ApiResponse.success(courseService.createCourse(UUID.fromString(userId), request));
    }

    @PutMapping("/{courseId}")
    public ApiResponse<CourseResponse> updateCourse(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID courseId,
            @Valid @RequestBody CourseRequest request) {
        log.info("Updating course: {} for user: {}", courseId, userId);
        return ApiResponse.success(courseService.updateCourse(courseId, UUID.fromString(userId), request));
    }

    @GetMapping("/public/{courseId}")
    public ApiResponse<CourseResponse> getJobById(
            @PathVariable UUID courseId,
            @RequestParam(required = false) Boolean isVisited
    ) {
        log.info("Fetching course: {}", courseId);
        return ApiResponse.success(courseService.getCourseById(courseId, isVisited));
    }

//    @GetMapping("/{courseId}")
//    public ApiResponse<CourseResponse> getCourseById(@PathVariable UUID courseId) {
//        log.info("Fetching course: {}", courseId);
//        return ApiResponse.success(courseService.getCourseById(courseId));
//    }

    @GetMapping
    public ApiResponse<Page<CourseListResponse>> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String enrollType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching all courses with filter");
        return ApiResponse.success(courseService.getAllCourses(search, category, enrollType, location, status, pageable));
    }

    @GetMapping("/public/search")
    public ApiResponse<Page<CoursePublicListResponse>> getPublicCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String migrationPath,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String requirementLevel,
            Pageable pageable) {
        log.info("Searching courses with keyword: {}", keyword);
        return ApiResponse.success(courseService.getPublicCourses(keyword, migrationPath, category, requirementLevel, pageable));
    }

    @GetMapping("/admin")
    public ApiResponse<Page<CourseAdminListResponse>> getAdminAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String enrollType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching all courses with filter for admin");
        return ApiResponse.success(courseService.getAdminAllCourses(search, category, enrollType, location, status, pageable));
    }

    @GetMapping("/company")
    public ApiResponse<Page<CourseListResponse>> getCoursesByCompany(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching courses for company: {}", userId);
        return ApiResponse.success(courseService.getCoursesByCompany(UUID.fromString(userId), status, pageable));
    }

    @GetMapping("/pending")
    public ApiResponse<Page<CourseListResponse>> getPendingCourses(Pageable pageable) {
        log.info("Fetching pending courses for admin approval");
        return ApiResponse.success(courseService.getPendingCourses(pageable));
    }

    @PostMapping("/{courseId}/approve")
    public ApiResponse<Void> approveCourse(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID courseId) {
        log.info("Approving course: {} by admin: {}", courseId, adminId);
        courseService.approveCourse(courseId, UUID.fromString(adminId));
        return ApiResponse.success(null);
    }

    @PostMapping("/{courseId}/reject")
    public ApiResponse<Void> rejectCourse(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID courseId,
            @RequestParam String reason) {
        log.info("Rejecting course: {} by admin: {}", courseId, adminId);
        courseService.rejectCourse(courseId, UUID.fromString(adminId), reason);
        return ApiResponse.success(null);
    }

    @PostMapping("/{courseId}/close")
    public ApiResponse<CourseResponse> closeCourse(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID courseId) {
        log.info("Closing course: {} by user: {}", courseId, userId);
        return ApiResponse.success(courseService.closeCourse(courseId, UUID.fromString(userId)));
    }

    @DeleteMapping("/{courseId}")
    public ApiResponse<Void> deleteCourse(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID courseId) {
        log.info("Deleting course: {} by user: {}", courseId, userId);
        courseService.deleteCourse(courseId, UUID.fromString(userId));
        return ApiResponse.success(null);
    }

    @GetMapping("/company/counts")
    public ApiResponse<CourseCountsResponse> getCourseCounts(
            @RequestHeader("X-User-Id") String userId) {
        log.info("Getting course counts for company: {}", userId);
        return ApiResponse.success(courseService.getCompanyCourseCounts(UUID.fromString(userId)));
    }

    @GetMapping("/admin/counts")
    public ApiResponse<CourseCountsResponse> getAdminCourseCounts(
//            @RequestHeader("X-User-Id") String userId
    ) {
//        log.info("Getting course counts for admin: {}", userId);
        return ApiResponse.success(courseService.getAdminCourseCounts());
    }

    @GetMapping("/company/{courseId}")
    public ApiResponse<CourseResponse> getCompanyCourseById(@PathVariable UUID courseId) {
        log.info("Fetching company course: {}", courseId);
        return ApiResponse.success(courseService.getCompanyCourseById(courseId));
    }

    @PostMapping("/upload/course-image")
    public ApiResponse<CourseImageUploadResponse> uploadCourseImage(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(courseService.uploadCourseImage(UUID.fromString(userId), file));
    }
}