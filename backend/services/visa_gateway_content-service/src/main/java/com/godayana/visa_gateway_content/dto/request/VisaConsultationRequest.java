package com.godayana.visa_gateway_content.dto.request;

import com.godayana.visa_gateway_content.entity.VisaConsultation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisaConsultationRequest {
    private VisaConsultation.VisaType type;
    private String country;
    private Boolean visaRejection;
    private Boolean hasPassport;
    private LocalDateTime travelDate;
    private String note;
}