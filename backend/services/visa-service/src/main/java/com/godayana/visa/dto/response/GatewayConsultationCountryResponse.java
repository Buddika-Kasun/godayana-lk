package com.godayana.visa.dto.response;

import com.godayana.visa.entity.GatewayConsultation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GatewayConsultationCountryResponse {
    private UUID id;
    private UUID seekerId;
    private String seekerName;
    private String seekerEmail;
    private String seekerPhone;
    private String seekerProfileImage;
    private String country;
    private String otherCountry;
    private String studyField;
    private String otherStudyField;
    private String studyLevel;
    private String intake;
    private String universityType;
    private String languageTestStatus;
    private BigDecimal budget;
    private String familySponsorship;
    private String educationLoan;
    private String visaRejection;
    private String hasPassport;
    private String applyWithin;
    private GatewayConsultation.ConsultationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
