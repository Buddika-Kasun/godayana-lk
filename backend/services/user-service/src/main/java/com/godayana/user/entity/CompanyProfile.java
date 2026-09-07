package com.godayana.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "company_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "website")
    private String website;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "description")
    private String description;

    @Column(name = "industry")
    private String industry;

    @Column(name = "company_type")
    private String companyType;

    @Column(name = "employee_count")
    private String employeeCount;

    @Column(name = "location")
    private String location;

    @Column(name = "company_email")
    private String companyEmail;

    @Column(name = "hotline_number")
    private String hotlineNumber;

    @Column(name = "facebook_url")
    private String facebookUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "instagram_url")
    private String instagramUrl;

    @Column(name = "contact_person_name")
    private String contactPersonName;

    @Column(name = "designation")
    private String designation;

    @Column(name = "cv_delivery_email")
    private String cvDeliveryEmail;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "is_profile_Complete")
    private Boolean isProfileComplete = false;

    @Column(name = "cv_delivery_terms")
    private Boolean cvDeliveryTerms;

    @Column(name = "job_posting_terms")
    private Boolean jobPostingTerms;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private CompanyStatus status = CompanyStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CompanyStatus {
        PENDING, APPROVED, SUSPENDED, REJECTED
    }
}