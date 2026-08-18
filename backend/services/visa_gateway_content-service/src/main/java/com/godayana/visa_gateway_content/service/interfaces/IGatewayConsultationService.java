package com.godayana.visa_gateway_content.service.interfaces;

import com.godayana.visa_gateway_content.dto.request.GatewayConsultationRequest;
import com.godayana.visa_gateway_content.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IGatewayConsultationService {

    GatewayConsultationResponse createConsultation(UUID seekerId, GatewayConsultationRequest request);

    GatewayConsultationResponse getConsultationById(UUID consultationId);

    Page<GatewayConsultationResponse> getConsultationsBySeeker(UUID seekerId, Pageable pageable);

    Page<GatewayConsultationCountryResponse> getConsultationsByCountryAndFilters(String country, String status, Pageable pageable);

    Page<CountryCountResponse> getCountryCounts(Pageable pageable);

    Page<GatewayConsultationResponse> getConsultationsBySeekerAndStatus(UUID seekerId, String status, Pageable pageable);

    GatewayConsultationResponse updateConsultationStatus(UUID consultationId, String status);

    GatewayConsultationResponse updateConsultation(UUID consultationId, GatewayConsultationRequest request);

    GatewayCountryCountResponse countConsultationsByCountry(String country);

    long countConsultationsBySeekerAndStatus(UUID seekerId, String status);
}