package com.godayana.visa.entity;

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
@Table(name = "visa_consultation")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisaConsultation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "seeker_id", nullable = false)
    private UUID seekerId;

    @Column(name = "type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private VisaType type;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "visa_rejection")
    private Boolean visaRejection;

    @Column(name = "has_passport")
    private Boolean hasPassport;

    @Column(name = "travel_date")
    private LocalDateTime travelDate;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

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

    // Enums matching the CHECK constraints
    public enum VisaType {
        STUDENT, WORK, VISIT
    }

    public enum ConsultationStatus {
        PENDING, REVIEW, CANCELLED, COMPLETED
    }
}