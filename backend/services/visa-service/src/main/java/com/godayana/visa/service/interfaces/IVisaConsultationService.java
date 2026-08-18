package com.godayana.visa.service.interfaces;

import com.godayana.visa.dto.request.VisaConsultationRequest;
import com.godayana.visa.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IVisaConsultationService {

    VisaConsultationResponse createConsultation(UUID seekerId, VisaConsultationRequest request);

    VisaConsultationResponse getConsultationById(UUID consultationId);

    Page<VisaConsultationResponse> getConsultationsBySeeker(UUID seekerId, Pageable pageable);

    Page<VisaConsultationCountryResponse> getConsultationsByCountryAndFilters(String country, String type, String status, Pageable pageable);

    Page<CountryCountResponse> getCountryCounts(Pageable pageable);

    Page<VisaConsultationResponse> getConsultationsBySeekerAndStatus(UUID seekerId, String status, Pageable pageable);

    VisaConsultationResponse updateConsultationStatus(UUID consultationId, String status);

    VisaConsultationResponse updateConsultation(UUID consultationId, VisaConsultationRequest request);

    VisaGatewayCountResponse countConsultationsBySeeker(UUID seekerId);

    VisaGatewayCountResponse countConsultations();

    VisaCountryCountResponse countConsultationsByCountry(String country, String type);

    long countConsultationsBySeekerAndStatus(UUID seekerId, String status);
}