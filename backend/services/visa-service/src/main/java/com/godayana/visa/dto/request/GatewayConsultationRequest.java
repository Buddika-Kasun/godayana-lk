package com.godayana.visa.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GatewayConsultationRequest {
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
}