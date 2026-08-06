package com.godayana.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "seeker_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "skills")
    private String[] skills;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "education")
    private String education;

    @Column(name = "study_field")
    private String studyField;

    @Column(name = "location")
    private String location;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "nationality")
    private String nationality;

    @Column(name = "employment_status")
    private String employmentStatus;

    @Column(name = "current_job_title")
    private String currentJobTitle;

    @Column(name = "current_salary")
    private BigDecimal currentSalary;

    @Column(name = "expected_salary")
    private BigDecimal expectedSalary;

    @Column(name = "notice_period")
    private String noticePeriod;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "professional_summary")
    private String professionalSummary;

    @Column(name = "preferred_job_categories")
    private String[] preferredJobCategories;

    @Column(name = "share_cv")
    private Boolean shareCv = true;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ProfileStatus status;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ProfileStatus {
        PENDING, APPROVED, REJECTED, SUSPENDED
    }
}