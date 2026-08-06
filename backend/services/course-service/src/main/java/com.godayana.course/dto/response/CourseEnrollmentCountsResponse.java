package com.godayana.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseEnrollmentCountsResponse {
    String courseTitle;
    long all;
    long pending;
    long enrolled;
    long rejected;
}

