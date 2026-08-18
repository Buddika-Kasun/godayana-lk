package com.godayana.job.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationCountsResponse {
    String jobTitle;
    long all;
    long pending;
    long active;
    long shortlisted;
    long hired;
    long rejected;
}

