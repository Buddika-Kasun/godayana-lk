package com.godayana.job.service.impl;

import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.job.dto.response.JobSaveResponse;
import com.godayana.job.entity.Job;
import com.godayana.job.entity.JobSave;
import com.godayana.job.repository.JobRepository;
import com.godayana.job.repository.JobSaveRepository;
import com.godayana.job.service.interfaces.IJobSaveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobSaveServiceImpl implements IJobSaveService {

    private final JobSaveRepository jobSaveRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional
    public JobSaveResponse saveJob(UUID seekerId, UUID jobId) {
        log.info("Save job: {} by seeker: {}", jobId, seekerId);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (job.getStatus() != Job.JobStatus.APPROVED) {
            throw new BusinessException("Job is not open for save",
                    ErrorCode.BUSINESS_ERROR.getCode(), 400);
        }

        if (jobSaveRepository.existsBySeekerIdAndJobId(seekerId, jobId)) {
            throw new BusinessException("You have already saved this job",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(), 409);
        }

        JobSave savedJob = JobSave.builder()
                .jobId(jobId)
                .seekerId(seekerId)
                .build();

        savedJob = jobSaveRepository.save(savedJob);

        return mapToResponse(savedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobSaveResponse> getSavedJobsBySeeker(UUID seekerId, Pageable pageable) {
        return jobSaveRepository.findBySeekerId(seekerId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void removeSavedJob(UUID seekerId, UUID jobId) {
        jobSaveRepository.deleteBySeekerIdAndJobId(seekerId, jobId);
    }

    @Override
    @Transactional
    public void removeAllSeekerSavedJob(UUID seekerId) {
        jobSaveRepository.deleteAllBySeekerId(seekerId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countSavedJobsBySeeker(UUID seekerId) {
        return jobSaveRepository.countBySeekerId(seekerId);
    }

    @Override
    public Boolean checkSavedJob(UUID seekerId, UUID jobId) {
        return jobSaveRepository.existsBySeekerIdAndJobId(seekerId, jobId);
    }

    private JobSaveResponse mapToResponse(JobSave savedJob) {
        return JobSaveResponse.builder()
                .jobId(savedJob.getJobId())
                .seekerId(savedJob.getSeekerId())
                .savedAt(savedJob.getSavedAt())
                .build();
    }

}