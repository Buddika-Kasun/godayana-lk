package com.godayana.job.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedJobId implements Serializable {
    private UUID seekerId;
    private UUID jobId;
}