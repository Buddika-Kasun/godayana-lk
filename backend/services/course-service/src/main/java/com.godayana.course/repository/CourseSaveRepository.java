package com.godayana.course.repository;

import com.godayana.course.dto.CourseEnrollmentSummary;
import com.godayana.course.entity.CourseSave;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CourseSaveRepository extends JpaRepository<CourseSave, UUID> {

    Page<CourseSave> findByCourseId(UUID courseId, Pageable pageable);

    Page<CourseSave> findBySeekerId(UUID seekerId, Pageable pageable);

    boolean existsBySeekerIdAndCourseId(UUID seekerId, UUID courseId);

    long countByCourseId(UUID courseId);

    long countBySeekerId(UUID seekerId);

    void deleteBySeekerIdAndCourseId(UUID seekerId, UUID courseId);

    void deleteAllBySeekerId(UUID seekerId);

//    @Query("SELECT js.jobId FROM JobSave js WHERE js.seekerId = :seekerId")
//    List<UUID> findAllCourseIdsBySeekerId(UUID seekerId);

    @Query("SELECT new com.godayana.course.dto.CourseEnrollmentSummary(" +
            "cs.courseId, cs.seekerId, c.title, c.location, c.companyId, cs.savedAt, ce.status) " +
            "FROM CourseSave cs " +
            "LEFT JOIN Course c ON cs.courseId = c.id " +
            "LEFT JOIN CourseEnrollment ce ON ce.courseId = c.id AND ce.seekerId = cs.seekerId " +
            "WHERE cs.seekerId = :seekerId")
    Page<CourseEnrollmentSummary> findSaveSummariesBySeekerIdAndStatuses(
            @Param("seekerId") UUID seekerId,
            Pageable pageable
    );
}