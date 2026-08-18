package com.godayana.course.service.interfaces;

import com.godayana.course.dto.request.CourseRequest;
import com.godayana.course.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ICourseService {

    CourseResponse createCourse(UUID companyId, CourseRequest request);

    CourseResponse updateCourse(UUID courseId, UUID companyId, CourseRequest request);

    CourseResponse getCourseById(UUID courseId, Boolean isVisited);

    CourseResponse getCompanyCourseById(UUID courseId);

    Page<CourseListResponse> getAllCourses(String search, String category, String enrollType,
                                           String location, String status, Pageable pageable);

    Page<CoursePublicListResponse> getPublicCourses(String keyword, String migrationPath, String category, String requirementLevel, Pageable pageable);

    Page<CourseAdminListResponse> getAdminAllCourses(String search, String category, String enrollType,
                                                     String location, String status, Pageable pageable);

    Page<CourseListResponse> getCoursesByCompany(UUID companyId, String status, Pageable pageable);

    Page<CourseListResponse> getPendingCourses(Pageable pageable);

    void approveCourse(UUID courseId, UUID adminId);

    void rejectCourse(UUID courseId, UUID adminId, String reason);

    CourseResponse closeCourse(UUID courseId, UUID userId);

    void deleteCourse(UUID courseId, UUID userId);

    void incrementViewCount(UUID courseId);

    void incrementEnrollmentCount(UUID courseId);

    CourseCountsResponse getCompanyCourseCounts(UUID companyId);

    CourseCountsResponse getAdminCourseCounts();

    CourseImageUploadResponse uploadCourseImage(UUID companyId, MultipartFile file);

}