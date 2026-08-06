package com.godayana.visa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "gateway_consultation")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GatewayConsultation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "seeker_id", nullable = false)
    private UUID seekerId;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "other_country", length = 100)
    private String otherCountry;

    @Column(name = "study_field", length = 100)
    private String studyField;

    @Column(name = "other_study_field", length = 100)
    private String otherStudyField;

    @Column(name = "study_level", length = 100)
    private String studyLevel;

    @Column(name = "intake", length = 50)
    private String intake;

    @Column(name = "university_type", length = 50)
    private String universityType;

    @Column(name = "language_test_status", length = 50)
    private String languageTestStatus;

    @Column(name = "budget", precision = 20, scale = 2)
    private BigDecimal budget;

    @Column(name = "family_sponsorship", length = 5)
    private String familySponsorship;

    @Column(name = "education_loan", length = 5)
    private String educationLoan;

    @Column(name = "visa_rejection", length = 5)
    private String visaRejection;

    @Column(name = "has_passport", length = 5)
    private String hasPassport;

    @Column(name = "apply_within", length = 20)
    private String applyWithin;

    @Column(name = "status", length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ConsultationStatus status = ConsultationStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ConsultationStatus {
        PENDING, REVIEW, CANCELLED, COMPLETED
    }
}