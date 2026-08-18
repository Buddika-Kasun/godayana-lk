package com.godayana.course.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "saved_courses")
@IdClass(SavedCourseId.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSave {

    @Id
    @Column(name = "seeker_id", nullable = false)
    private UUID seekerId;

    @Id
    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @CreationTimestamp
    @Column(name = "saved_at", updatable = false)
    private LocalDateTime savedAt;
}