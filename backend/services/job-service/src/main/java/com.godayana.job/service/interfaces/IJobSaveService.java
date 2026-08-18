package com.godayana.job.service.interfaces;

import com.godayana.job.dto.response.JobSaveResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IJobSaveService {

    JobSaveResponse saveJob(UUID seekerId, UUID jobId);

    Page<JobSaveResponse> getSavedJobsBySeeker(UUID seekerId, Pageable pageable);

    void removeSavedJob(UUID seekerId, UUID jobId);

    void removeAllSeekerSavedJob(UUID seekerId);

    long countSavedJobsBySeeker(UUID seekerId);

    Boolean checkSavedJob(UUID seekerId, UUID jobId);

}