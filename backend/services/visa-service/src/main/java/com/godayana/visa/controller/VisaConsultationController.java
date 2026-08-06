package com.godayana.visa.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.visa.dto.request.VisaConsultationRequest;
import com.godayana.visa.dto.response.*;
import com.godayana.visa.service.interfaces.IVisaConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/visa-consultations")
@RequiredArgsConstructor
@Slf4j
public class VisaConsultationController {

    private final IVisaConsultationService visaConsultationService;

    @PostMapping
    public ApiResponse<VisaConsultationResponse> createConsultation(
            @RequestHeader("X-User-Id") String seekerId,
            @Valid @RequestBody VisaConsultationRequest request) {
        log.info("Creating visa consultation for seeker: {}", seekerId);
        return ApiResponse.success(visaConsultationService.createConsultation(
                UUID.fromString(seekerId), request));
    }

    @GetMapping("/me")
    public ApiResponse<Page<VisaConsultationResponse>> getMyConsultations(
            @RequestHeader("X-User-Id") String seekerId,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching visa consultations for seeker: {}", seekerId);

        if (status != null && !status.isEmpty()) {
            return ApiResponse.success(visaConsultationService.getConsultationsBySeekerAndStatus(
                    UUID.fromString(seekerId), status, pageable));
        }

        return ApiResponse.success(visaConsultationService.getConsultationsBySeeker(
                UUID.fromString(seekerId), pageable));
    }

    @GetMapping("/admin")
    public ApiResponse<Page<CountryCountResponse>> getAdminConsultations(
            Pageable pageable
    ) {
        log.info("Fetching visa consultations for admin");

        return ApiResponse.success(visaConsultationService.getCountryCounts(pageable));
    }

    @GetMapping("/admin/country")
    public ApiResponse<Page<VisaConsultationCountryResponse>> getAdminCountryConsultations(
            @RequestParam String country,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            Pageable pageable
    ) {
        log.info("Fetching visa consultations for admin by country: {}", country);

        return ApiResponse.success(visaConsultationService.getConsultationsByCountryAndFilters(country, type, status, pageable));
    }

    @GetMapping("/{consultationId}")
    public ApiResponse<VisaConsultationResponse> getConsultationById(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID consultationId) {
        log.info("Fetching visa consultation: {} by user: {}", consultationId, userId);
        return ApiResponse.success(visaConsultationService.getConsultationById(consultationId));
    }

    @PutMapping("/{consultationId}/status")
    public ApiResponse<VisaConsultationResponse> updateConsultationStatus(
            @PathVariable UUID consultationId,
            @RequestParam String status) {
        log.info("Updating visa consultation: {} status to: {}", consultationId, status);
        return ApiResponse.success(visaConsultationService.updateConsultationStatus(
                consultationId, status));
    }

    @PutMapping("/{consultationId}")
    public ApiResponse<VisaConsultationResponse> updateConsultation(
            @PathVariable UUID consultationId,
            @Valid @RequestBody VisaConsultationRequest request) {
        log.info("Updating visa consultation: {}", consultationId);
        return ApiResponse.success(visaConsultationService.updateConsultation(
                consultationId, request));
    }

    @GetMapping("/count")
    public ApiResponse<VisaGatewayCountResponse> countMyConsultations(
            @RequestHeader("X-User-Id") String seekerId) {
        log.info("Counting visa consultations for seeker: {}", seekerId);
        return ApiResponse.success(visaConsultationService.countConsultationsBySeeker(
                UUID.fromString(seekerId)));
    }

    @GetMapping("/admin/count")
    public ApiResponse<VisaGatewayCountResponse> countAdminConsultations() {
        log.info("Counting visa consultations for admin");
        return ApiResponse.success(visaConsultationService.countConsultations());
    }

    @GetMapping("/admin/count-country")
    public ApiResponse<VisaCountryCountResponse> countAdminConsultationsByCountry(
            @RequestParam String country,
            @RequestParam(required = false) String type
    ) {
        log.info("Counting visa consultations for admin by country: {}", country);
        return ApiResponse.success(visaConsultationService.countConsultationsByCountry(country, type));
    }
}