package com.godayana.visa_gateway_content.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.visa_gateway_content.dto.request.GatewayConsultationRequest;
import com.godayana.visa_gateway_content.dto.response.*;
import com.godayana.visa_gateway_content.service.interfaces.IGatewayConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gateway-consultations")
@RequiredArgsConstructor
@Slf4j
public class GatewayConsultationController {

    private final IGatewayConsultationService gatewayConsultationService;

    @PostMapping
    public ApiResponse<GatewayConsultationResponse> createConsultation(
            @RequestHeader("X-User-Id") String seekerId,
            @Valid @RequestBody GatewayConsultationRequest request) {
        log.info("Creating gateway consultation for seeker: {}", seekerId);
        return ApiResponse.success(gatewayConsultationService.createConsultation(
                UUID.fromString(seekerId), request));
    }

    @GetMapping("/me")
    public ApiResponse<Page<GatewayConsultationResponse>> getMyConsultations(
            @RequestHeader("X-User-Id") String seekerId,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching gateway consultations for seeker: {}", seekerId);

        if (status != null && !status.isEmpty()) {
            return ApiResponse.success(gatewayConsultationService.getConsultationsBySeekerAndStatus(
                    UUID.fromString(seekerId), status, pageable));
        }

        return ApiResponse.success(gatewayConsultationService.getConsultationsBySeeker(
                UUID.fromString(seekerId), pageable));
    }

    @GetMapping("/admin")
    public ApiResponse<Page<CountryCountResponse>> getAdminConsultations(
            Pageable pageable
    ) {
        log.info("Fetching visa consultations for admin");

        return ApiResponse.success(gatewayConsultationService.getCountryCounts(pageable));
    }

    @GetMapping("/admin/country")
    public ApiResponse<Page<GatewayConsultationCountryResponse>> getAdminCountryConsultations(
            @RequestParam String country,
            @RequestParam(required = false) String status,
            Pageable pageable
    ) {
        log.info("Fetching gateway consultations for admin by country: {}", country);

        return ApiResponse.success(gatewayConsultationService.getConsultationsByCountryAndFilters(country, status, pageable));
    }

    @GetMapping("/{consultationId}")
    public ApiResponse<GatewayConsultationResponse> getConsultationById(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID consultationId) {
        log.info("Fetching gateway consultation: {} by user: {}", consultationId, userId);
        return ApiResponse.success(gatewayConsultationService.getConsultationById(consultationId));
    }

    @PutMapping("/{consultationId}/status")
    public ApiResponse<GatewayConsultationResponse> updateConsultationStatus(
            @PathVariable UUID consultationId,
            @RequestParam String status) {
        log.info("Updating gateway consultation: {} status to: {}", consultationId, status);
        return ApiResponse.success(gatewayConsultationService.updateConsultationStatus(
                consultationId, status));
    }

    @PutMapping("/{consultationId}")
    public ApiResponse<GatewayConsultationResponse> updateConsultation(
            @PathVariable UUID consultationId,
            @Valid @RequestBody GatewayConsultationRequest request) {
        log.info("Updating gateway consultation: {}", consultationId);
        return ApiResponse.success(gatewayConsultationService.updateConsultation(
                consultationId, request));
    }

    @GetMapping("/admin/count-country")
    public ApiResponse<GatewayCountryCountResponse> countAdminConsultationsByCountry(
            @RequestParam String country
    ) {
        log.info("Counting visa consultations for admin by country: {}", country);
        return ApiResponse.success(gatewayConsultationService.countConsultationsByCountry(country));
    }
}