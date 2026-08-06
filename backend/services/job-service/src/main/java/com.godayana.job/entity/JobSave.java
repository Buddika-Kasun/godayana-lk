package com.godayana.job.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "saved_jobs")
@IdClass(SavedJobId.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSave {

    @Id
    @Column(name = "seeker_id", nullable = false)
    private UUID seekerId;

    @Id
    @Column(name = "job_id", nullable = false)
    private UUID jobId;

    @CreationTimestamp
    @Column(name = "saved_at", updatable = false)
    private LocalDateTime savedAt;
}