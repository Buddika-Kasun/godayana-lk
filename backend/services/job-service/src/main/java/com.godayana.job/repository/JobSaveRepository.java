package com.godayana.job.repository;

import com.godayana.job.dto.JobApplicationSummary;
import com.godayana.job.entity.JobApplication;
import com.godayana.job.entity.JobSave;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobSaveRepository extends JpaRepository<JobSave, UUID> {

    Page<JobSave> findByJobId(UUID jobId, Pageable pageable);

    Page<JobSave> findBySeekerId(UUID seekerId, Pageable pageable);

    boolean existsBySeekerIdAndJobId(UUID seekerId, UUID jobId);

    long countByJobId(UUID jobId);

    long countBySeekerId(UUID seekerId);

    void deleteBySeekerIdAndJobId(UUID seekerId, UUID jobId);

    void deleteAllBySeekerId(UUID seekerId);

    @Query("SELECT js.jobId FROM JobSave js WHERE js.seekerId = :seekerId")
    List<UUID> findAllJobIdsBySeekerId(UUID seekerId);

    @Query("SELECT new com.godayana.job.dto.JobApplicationSummary(" +
            "js.jobId, js.seekerId, j.jobTitle, j.location, j.companyId, js.savedAt, ja.status) " +
            "FROM JobSave js " +
            "LEFT JOIN Job j ON js.jobId = j.id " +
            "LEFT JOIN JobApplication ja ON ja.jobId = j.id AND ja.seekerId = js.seekerId " +
            "WHERE js.seekerId = :seekerId")
    Page<JobApplicationSummary> findSaveSummariesBySeekerIdAndStatuses(
            @Param("seekerId") UUID seekerId,
            Pageable pageable
    );
}