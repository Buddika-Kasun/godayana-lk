package com.godayana.course.repository;

import com.godayana.course.dto.CourseEnrollmentSummary;
import com.godayana.course.entity.CourseEnrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, UUID> {

    Page<CourseEnrollment> findByCourseId(UUID courseId, Pageable pageable);

    Page<CourseEnrollment> findBySeekerId(UUID seekerId, Pageable pageable);

    @Query("SELECT new com.godayana.course.dto.CourseEnrollmentSummary(" +
            "ce.id, ce.courseId, ce.seekerId, ce.status, ce.enrolledAt, c.title, c.location, c.companyId) " +
            "FROM CourseEnrollment ce LEFT JOIN Course c ON ce.courseId = c.id " +
            "WHERE ce.seekerId = :seekerId AND ce.status IN :statuses")
    Page<CourseEnrollmentSummary> findSummariesBySeekerIdAndStatuses(
            @Param("seekerId") UUID seekerId,
            @Param("statuses") List<CourseEnrollment.EnrollmentStatus> statuses,
            Pageable pageable
    );

    @Query("SELECT new com.godayana.course.dto.CourseEnrollmentSummary(" +
            "ce.id, ce.courseId, ce.seekerId, ce.status, ce.enrolledAt, c.title, c.location, c.companyId) " +
            "FROM CourseEnrollment ce LEFT JOIN Course c ON ce.courseId = c.id " +
            "WHERE ce.courseId = :courseId AND ce.status IN :statuses")
    Page<CourseEnrollmentSummary> findSummariesByCourseIdAndStatus(
            @Param("courseId") UUID courseId,
            @Param("statuses") List<CourseEnrollment.EnrollmentStatus> statuses,
            Pageable pageable
    );

    @Query("SELECT ce.courseId FROM CourseEnrollment ce WHERE ce.seekerId = :seekerId")
    Page<UUID> findEnrollmentIdsBySeekerId(@Param("seekerId") UUID seekerId, Pageable pageable);

    boolean existsBySeekerIdAndCourseId(UUID seekerId, UUID courseId);

    @Query("SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.courseId = :courseId")
    long countByCourseId(UUID courseId);

    @Query("SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.courseId = :courseId AND ce.status = :status")
    long countByCourseIdAndStatus(UUID courseId, CourseEnrollment.EnrollmentStatus status);

    @Query("SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.seekerId = :seekerId AND ce.status = :status")
    long countBySeekerIdAndStatus(UUID seekerId, @Param("status") CourseEnrollment.EnrollmentStatus status);

    @Query("SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.seekerId = :seekerId")
    long countBySeekerId(UUID seekerId);

    @Query("UPDATE CourseEnrollment ce SET ce.status = :status WHERE ce.id = :enrollmentId")
    void updateStatus(UUID enrollmentId, CourseEnrollment.EnrollmentStatus status);
}