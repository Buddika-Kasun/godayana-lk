package com.godayana.course.repository;

import com.godayana.course.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    Page<Course> findByCompanyId(UUID companyId, Pageable pageable);

    @Query("SELECT c.title FROM Course c WHERE c.id = :courseId")
    String findCourseNameById(UUID courseId);

    Page<Course> findByCompanyIdAndStatus(UUID companyId, Course.CourseStatus status, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.companyId = :companyId AND c.status IN :statuses")
    Page<Course> findByCompanyIdAndStatusIn(
            @Param("companyId") UUID companyId,
            @Param("statuses") List<Course.CourseStatus> statuses,
            Pageable pageable);

    Page<Course> findByStatus(Course.CourseStatus status, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE " +
            "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:category IS NULL OR LOWER(c.category) = LOWER(:category)) AND " +
            "(:enrollType IS NULL OR c.enrollType = :enrollType) AND " +
            "(:location IS NULL OR LOWER(c.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:status IS NULL OR c.status = :status)")
    Page<Course> searchCourses(@Param("search") String search,
                               @Param("category") String category,
                               @Param("enrollType") String enrollType,
                               @Param("location") String location,
                               @Param("status") String status,
                               Pageable pageable);

    @Query(value = "SELECT * FROM courses c WHERE " +
            "(:search IS NULL OR c.title ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
            "c.description ILIKE CONCAT('%', CAST(:search AS text), '%')) AND " +
            "(:category IS NULL OR c.category ILIKE CAST(:category AS text)) AND " +
            "(:enrollType IS NULL OR c.enroll_type = CAST(:enrollType AS text)) AND " +
            "(:location IS NULL OR c.location ILIKE CONCAT('%', CAST(:location AS text), '%')) AND " +
            "(:status IS NULL OR c.status = CAST(:status AS text))",
            countQuery = "SELECT COUNT(*) FROM courses c WHERE " +
                    "(:search IS NULL OR c.title ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
                    "c.description ILIKE CONCAT('%', CAST(:search AS text), '%')) AND " +
                    "(:category IS NULL OR c.category ILIKE CAST(:category AS text)) AND " +
                    "(:enrollType IS NULL OR c.enroll_type = CAST(:enrollType AS text)) AND " +
                    "(:location IS NULL OR c.location ILIKE CONCAT('%', CAST(:location AS text), '%')) AND " +
                    "(:status IS NULL OR c.status = CAST(:status AS text))",
            nativeQuery = true)
    Page<Course> searchCoursesNative(@Param("search") String search,
                                     @Param("category") String category,
                                     @Param("enrollType") String enrollType,
                                     @Param("location") String location,
                                     @Param("status") String status,
                                     Pageable pageable);

    @Query(value = "SELECT * FROM courses c WHERE " +
            "(:keyword IS NULL OR " +
            "c.title ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
            "c.description ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
            "c.category ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
            "c.instructor ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
            "c.location ILIKE CONCAT('%', CAST(:keyword AS text), '%')) AND " +
            "(:category IS NULL OR c.category ILIKE CAST(:category AS text)) AND " +
            "(:migrationPath IS NULL OR EXISTS (" +
            "SELECT 1 FROM unnest(c.migration_paths) AS mp WHERE mp ILIKE CONCAT('%', CAST(:migrationPath AS text), '%'))) AND " +
            "(:requirementLevel IS NULL OR c.requirement_level ILIKE CAST(:requirementLevel AS text)) AND " +
//            "(:type IS NULL OR c.enroll_type = CAST(:type AS text)) AND " +
            "(:status IS NULL OR c.status = CAST(:status AS text))",
            countQuery = "SELECT COUNT(*) FROM courses c WHERE " +
                    "(:keyword IS NULL OR " +
                    "c.title ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
                    "c.description ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
                    "c.category ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
                    "c.instructor ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
                    "c.location ILIKE CONCAT('%', CAST(:keyword AS text), '%')) AND " +
                    "(:category IS NULL OR c.category ILIKE CAST(:category AS text)) AND " +
                    "(:migrationPath IS NULL OR EXISTS (" +
                    "SELECT 1 FROM unnest(c.migration_paths) AS mp WHERE mp ILIKE CONCAT('%', CAST(:migrationPath AS text), '%'))) AND " +
                    "(:requirementLevel IS NULL OR c.requirement_level ILIKE CAST(:requirementLevel AS text)) AND " +
//                    "(:type IS NULL OR c.enroll_type = CAST(:type AS text)) AND " +
                    "(:status IS NULL OR c.status = CAST(:status AS text))",
            nativeQuery = true)
    Page<Course> searchPublicCoursesNative(
            @Param("keyword") String keyword,
            @Param("migrationPath") String migrationPath,
            @Param("category") String category,
            @Param("requirementLevel") String requirementLevel,
            @Param("status") String status,
            Pageable pageable
    );

    @Modifying
    @Transactional
    @Query("UPDATE Course c SET c.viewCount = c.viewCount + 1 WHERE c.id = :courseId")
    void incrementViewCount(@Param("courseId") UUID courseId);

    @Modifying
    @Transactional
    @Query("UPDATE Course c SET c.enrollmentCount = c.enrollmentCount + 1 WHERE c.id = :courseId")
    void incrementEnrollmentCount(@Param("courseId") UUID courseId);

    long countByStatus(Course.CourseStatus status);

    long countByCompanyId(UUID companyId);

    @Query("SELECT COUNT(c) FROM Course c WHERE c.companyId = :companyId AND c.status = :status")
    long countByCompanyIdAndStatus(@Param("companyId") UUID companyId, @Param("status") Course.CourseStatus status);
}