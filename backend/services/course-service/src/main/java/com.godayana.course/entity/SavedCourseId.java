package com.godayana.course.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedCourseId implements Serializable {
    private UUID seekerId;
    private UUID courseId;
}