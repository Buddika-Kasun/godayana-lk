package com.godayana.job.repository;

import com.godayana.job.dto.JobApplicationSummary;
import com.godayana.job.entity.Job;
import com.godayana.job.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    Page<JobApplication> findByJobId(UUID jobId, Pageable pageable);

    Page<JobApplication> findBySeekerId(UUID seekerId, Pageable pageable);

    @Query("SELECT new com.godayana.job.dto.JobApplicationSummary(" +
            "ja.id, ja.jobId, ja.seekerId, ja.status, ja.appliedAt, j.jobTitle, j.location, j.companyId) " +
            "FROM JobApplication ja LEFT JOIN Job j ON ja.jobId = j.id " +
            "WHERE ja.seekerId = :seekerId AND ja.status IN :statuses")
    Page<JobApplicationSummary> findSummariesBySeekerIdAndStatuses(
            @Param("seekerId") UUID seekerId,
            @Param("statuses") List<JobApplication.ApplicationStatus> statuses,
            Pageable pageable
    );

    @Query("SELECT new com.godayana.job.dto.JobApplicationSummary(" +
            "ja.id, ja.jobId, ja.seekerId, ja.status, ja.appliedAt, j.jobTitle, j.location, j.companyId) " +
            "FROM JobApplication ja LEFT JOIN Job j ON ja.jobId = j.id " +
            "WHERE ja.jobId = :jobId AND ja.status IN :statuses")
    Page<JobApplicationSummary> findSummariesByJobIdAndStatus(
            @Param("jobId") UUID jobId,
            @Param("statuses") List<JobApplication.ApplicationStatus> statuses,
            Pageable pageable
    );

    @Query("SELECT ja.jobId FROM JobApplication ja WHERE ja.seekerId = :seekerId")
    Page<UUID> findApplicationIdsBySeekerId(@Param("seekerId") UUID seekerId, Pageable pageable);

    boolean existsBySeekerIdAndJobId(UUID seekerId, UUID jobId);

    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.jobId = :jobId")
    long countByJobId(UUID jobId);

    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.jobId = :jobId AND ja.status = :status")
    long countByJobIdAndStatus(UUID jobId, JobApplication.ApplicationStatus status);

    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.seekerId = :seekerId AND ja.status = :status")
    long countBySeekerIdAndStatus(UUID seekerId, @Param("status") JobApplication.ApplicationStatus status);

    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.seekerId = :seekerId")
    long countBySeekerId(UUID seekerId);

    @Query("UPDATE JobApplication ja SET ja.status = :status WHERE ja.id = :applicationId")
    void updateStatus(UUID applicationId, JobApplication.ApplicationStatus status);
}