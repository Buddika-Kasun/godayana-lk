package com.godayana.course.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseEnrollmentRequest {

    @NotNull(message = "Course ID is required")
    private UUID courseId;

//    private String coverLetter;
}