package com.godayana.visa.dto.response;

import com.godayana.visa.entity.VisaConsultation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisaConsultationCountryResponse {
    private UUID id;
    private UUID seekerId;
    private String seekerName;
    private String seekerEmail;
    private String seekerPhone;
    private String seekerProfileImage;
    private VisaConsultation.VisaType type;
    private String country;
    private Boolean visaRejection;
    private Boolean hasPassport;
    private LocalDateTime travelDate;
    private String note;
    private VisaConsultation.ConsultationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
