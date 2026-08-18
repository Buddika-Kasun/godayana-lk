package com.godayana.job.repository;

import com.godayana.job.entity.Job;
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
public interface JobRepository extends JpaRepository<Job, UUID> {

    @Query("SELECT j.jobTitle FROM Job j WHERE j.id = :jobId")
    String findJobNameById(UUID jobId);

    Page<Job> findByCompanyId(UUID companyId, Pageable pageable);

    Page<Job> findByCompanyIdAndStatus(UUID companyId, Job.JobStatus status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.companyId = :companyId AND j.status IN :statuses")
    Page<Job> findByCompanyIdAndStatusIn(
            @Param("companyId") UUID companyId,
            @Param("statuses") List<Job.JobStatus> statuses,
            Pageable pageable);

    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE " +
            "(:search IS NULL OR LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(j.jobDescription) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:type IS NULL OR j.type = :type) AND " +
            "(:employmentType IS NULL OR LOWER(j.employmentType) = LOWER(:employmentType)) AND " +
            "(:category IS NULL OR LOWER(j.category) = LOWER(:category)) AND " +
            "(:status IS NULL OR j.status = :status)")
    Page<Job> searchJobs(@Param("search") String search,
                         @Param("location") String location,
                         @Param("type") String type,
                         @Param("employmentType") String employmentType,
                         @Param("category") String category,
                         @Param("status") Job.JobStatus status,
                         Pageable pageable);

    @Query(value = "SELECT * FROM jobs j WHERE " +
            "(:search IS NULL OR j.job_title ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
            "j.job_description ILIKE CONCAT('%', CAST(:search AS text), '%')) AND " +
            "(:location IS NULL OR j.location ILIKE CONCAT('%', CAST(:location AS text), '%')) AND " +
            "(:type IS NULL OR j.type = CAST(:type AS text)) AND " +
            "(:employmentType IS NULL OR j.employment_type ILIKE CAST(:employmentType AS text)) AND " +
            "(:category IS NULL OR j.category ILIKE CAST(:category AS text)) AND " +
            "(:status IS NULL OR j.status = CAST(:status AS text))",
            countQuery = "SELECT COUNT(*) FROM jobs j WHERE " +
                    "(:search IS NULL OR j.job_title ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
                    "j.job_description ILIKE CONCAT('%', CAST(:search AS text), '%')) AND " +
                    "(:location IS NULL OR j.location ILIKE CONCAT('%', CAST(:location AS text), '%')) AND " +
                    "(:type IS NULL OR j.type = CAST(:type AS text)) AND " +
                    "(:employmentType IS NULL OR j.employment_type ILIKE CAST(:employmentType AS text)) AND " +
                    "(:category IS NULL OR j.category ILIKE CAST(:category AS text)) AND " +
                    "(:status IS NULL OR j.status = CAST(:status AS text))",
            nativeQuery = true)
    Page<Job> searchJobsNative(@Param("search") String search,
                               @Param("location") String location,
                               @Param("type") String type,
                               @Param("employmentType") String employmentType,
                               @Param("category") String category,
                               @Param("status") String status,
                               Pageable pageable);

    @Query(value = "SELECT * FROM jobs j WHERE " +
            "(:keyword IS NULL OR " +
            "j.job_title ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
            "j.job_description ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
            "j.category ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
            "j.location ILIKE CONCAT('%', CAST(:keyword AS text), '%')) AND " +
            "(:location IS NULL OR j.location ILIKE CONCAT('%', CAST(:location AS text), '%')) AND " +
            "(:category IS NULL OR j.category ILIKE CAST(:category AS text)) AND " +
            "(:employmentType IS NULL OR j.employment_type ILIKE CAST(:employmentType AS text)) AND " +
            "(:experience IS NULL OR CAST(j.min_experience AS integer) <= CAST(:experience AS integer)) AND " +
            "(:type IS NULL OR j.type = CAST(:type AS text)) AND " +
            "(:status IS NULL OR j.status = CAST(:status AS text))",
            countQuery = "SELECT COUNT(*) FROM jobs j WHERE " +
                    "(:keyword IS NULL OR " +
                    "j.job_title ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
                    "j.job_description ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
                    "j.category ILIKE CONCAT('%', CAST(:keyword AS text), '%') OR " +
                    "j.location ILIKE CONCAT('%', CAST(:keyword AS text), '%')) AND " +
                    "(:location IS NULL OR j.location ILIKE CONCAT('%', CAST(:location AS text), '%')) AND " +
                    "(:category IS NULL OR j.category ILIKE CAST(:category AS text)) AND " +
                    "(:employmentType IS NULL OR j.employment_type ILIKE CAST(:employmentType AS text)) AND " +
                    "(:experience IS NULL OR CAST(j.min_experience AS integer) <= CAST(:experience AS integer)) AND " +
                    "(:type IS NULL OR j.type = CAST(:type AS text)) AND " +
                    "(:status IS NULL OR j.status = CAST(:status AS text))",
            nativeQuery = true)
    Page<Job> searchPublicJobsNative(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("category") String category,
            @Param("employmentType") String employmentType,
            @Param("experience") String experience,
            @Param("status") String status,
            @Param("type") String type,
            Pageable pageable
    );

    @Query("SELECT j FROM Job j WHERE LOWER(j.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.jobDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Job> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Job j SET j.viewCount = j.viewCount + 1 WHERE j.id = :jobId")
    void incrementViewCount(@Param("jobId") UUID jobId);

    @Modifying
    @Transactional
    @Query("UPDATE Job j SET j.applicationCount = j.applicationCount + 1 WHERE j.id = :jobId")
    void incrementApplicationCount(@Param("jobId") UUID jobId);

    long countByStatus(Job.JobStatus status);

    long countByCompanyId(UUID companyId);

    // Add this method
    @Query("SELECT COUNT(j) FROM Job j WHERE j.companyId = :companyId AND j.status = :status")
    long countByCompanyIdAndStatus(@Param("companyId") UUID companyId, @Param("status") Job.JobStatus status);
}