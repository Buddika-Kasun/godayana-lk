package com.godayana.course.service.interfaces;

import com.godayana.course.dto.response.CourseEnrollmentCompanyResponse;
import com.godayana.course.dto.response.CourseEnrollmentCountsResponse;
import com.godayana.course.dto.response.CourseEnrollmentResponse;
import com.godayana.course.dto.response.CourseEnrollmentSeekerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ICourseEnrollmentService {

    CourseEnrollmentResponse enrollInCourse(UUID seekerId, UUID courseId);

    CourseEnrollmentCountsResponse countEnrollmentsByCourse(UUID courseId);

    CourseEnrollmentCountsResponse countEnrollmentsBySeeker(UUID seekerId);

    Page<CourseEnrollmentCompanyResponse> getEnrollmentsByCourse(UUID courseId, UUID companyId, String status, Pageable pageable);

//    Page<CourseEnrollmentResponse> getEnrollmentsBySeeker(UUID seekerId, Pageable pageable);

    CourseEnrollmentResponse getEnrollmentById(UUID enrollmentId);

    CourseEnrollmentResponse updateEnrollmentStatus(UUID enrollmentId, UUID companyId, String status);

    void withdrawEnrollment(UUID enrollmentId, UUID seekerId);

    boolean isEnrolled(UUID seekerId, UUID courseId);

//    long countEnrollmentsByCourse(UUID courseId);

    long countEnrollmentsByCourseAndStatus(UUID courseId, String status);

    Page<UUID> getEnrollmentIdsBySeeker(UUID seekerId, Pageable pageable);

    Page<CourseEnrollmentSeekerResponse> getEnrollmentsBySeekerAndStatus(UUID seekerId, String status, Pageable pageable);

}