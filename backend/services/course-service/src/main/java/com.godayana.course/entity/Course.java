package com.godayana.course.entity;

import com.godayana.course.dto.Curriculum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "category")
    private String category;

    @Column(name = "category_label")
    private String categoryLabel;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "enroll_type")
    @Enumerated(EnumType.STRING)
    private EnrollType enrollType;

    @Column(name = "location")
    private String location;

    @Column(name = "instructor")
    private String instructor;

    @Column(name = "instructor_bio", columnDefinition = "TEXT")
    private String instructorBio;

    @Column(name = "instructor_avatar")
    private String instructorAvatar;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "duration")
    private String duration;

    @Column(name = "schedule")
    private String schedule;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "max_students")
    private Integer maxStudents;

    @Column(name = "enrolled_students")
    private Integer enrolledStudents;

    @Column(name = "rating")
    private BigDecimal rating;

    @Column(name = "benefits")
    private String[] benefits;

    @Column(name = "requirements")
    private String[] requirements;

    @Column(name = "lessons")
    private String[] lessons;

    @Column(name = "learning_outcomes")
    private String[] learningOutcomes;

    @Column(name = "includes")
    private String[] includes;

    @Column(name = "target_audience")
    private String[] targetAudience;

    @Column(name = "certificate")
    private Boolean certificate;

    @Column(name = "certificate_type")
    private String certificateType;

    @Column(name = "course_image_url")
    private String courseImageUrl;

    @Column(name = "course_image_file_key")
    private String courseImageFileKey;

    @Column(name = "confirmation_email")
    private String confirmationEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "curriculum", columnDefinition = "JSONB")
    @JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private Curriculum curriculum;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private CourseStatus status;

    @Column(name = "migration_paths")
    private String[] migrationPaths;

    @Column(name = "requirement_level")
    private String requirementLevel;

    @Column(name = "view_count")
    private Integer viewCount;

    @Column(name = "enrollment_count")
    private Integer enrollmentCount;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EnrollType {
        online, physical
    }

    public enum CourseStatus {
        PENDING, APPROVED, REJECTED, CLOSED, DRAFT
    }
}