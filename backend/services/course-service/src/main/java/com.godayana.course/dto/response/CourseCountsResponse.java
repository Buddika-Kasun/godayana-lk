package com.godayana.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseCountsResponse {
    long all;
    long pending;
    long approved;
    long rejected;
    long closed;
    long draft;
}

