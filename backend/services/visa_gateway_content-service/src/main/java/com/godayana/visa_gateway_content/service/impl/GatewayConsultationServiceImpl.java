package com.godayana.visa_gateway_content.service.impl;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.seeker.SeekerDetailsResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.visa_gateway_content.dto.request.GatewayConsultationRequest;
import com.godayana.visa_gateway_content.dto.response.*;
import com.godayana.visa_gateway_content.entity.GatewayConsultation;
import com.godayana.visa_gateway_content.repository.GatewayConsultationRepository;
import com.godayana.visa_gateway_content.service.interfaces.IGatewayConsultationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GatewayConsultationServiceImpl implements IGatewayConsultationService {

    private final GatewayConsultationRepository gatewayConsultationRepository;

    private final WebClient.Builder webClientBuilder;

    @Value("${USER_SERVICE_URL}")
    private String userServiceUrl;

    @Override
    @Transactional
    public GatewayConsultationResponse createConsultation(UUID seekerId, GatewayConsultationRequest request) {
        log.info("Creating visa consultation for seeker: {}", seekerId);

        // Check if country is "other" to store the other country value
        boolean isOtherCountry = "other".equalsIgnoreCase(request.getCountry());
        boolean isOtherStudyField = "other".equalsIgnoreCase(request.getStudyField());

        GatewayConsultation consultation = GatewayConsultation.builder()
                .seekerId(seekerId)
                .country(request.getCountry())
                .otherCountry(isOtherCountry ? request.getOtherCountry() : null)
                .studyField(request.getStudyField())
                .otherStudyField(isOtherStudyField ? request.getOtherStudyField() : null)
                .studyLevel(request.getStudyLevel())
                .intake(request.getIntake())
                .universityType(request.getUniversityType())
                .languageTestStatus(request.getLanguageTestStatus())
                .budget(request.getBudget())
                .familySponsorship(request.getFamilySponsorship())
                .educationLoan(request.getEducationLoan())
                .visaRejection(request.getVisaRejection())
                .hasPassport(request.getHasPassport())
                .applyWithin(request.getApplyWithin())
                .status(GatewayConsultation.ConsultationStatus.PENDING)
                .build();

        consultation = gatewayConsultationRepository.save(consultation);
        return mapToResponse(consultation);
    }

    @Override
    @Transactional(readOnly = true)
    public GatewayConsultationResponse getConsultationById(UUID consultationId) {
        GatewayConsultation consultation = gatewayConsultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", "id", consultationId));
        return mapToResponse(consultation);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GatewayConsultationResponse> getConsultationsBySeeker(UUID seekerId, Pageable pageable) {
        return gatewayConsultationRepository.findBySeekerId(seekerId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GatewayConsultationCountryResponse> getConsultationsByCountryAndFilters(String country, String status, Pageable pageable) {
        Page<GatewayConsultation> consultations = gatewayConsultationRepository.findByCountryAndFilters(
                country,
                GatewayConsultation.ConsultationStatus.valueOf(status),
                pageable
        );

        // Get all seeker IDs from the jobs
        List<UUID> seekerIds = consultations.getContent().stream()
                .map(GatewayConsultation::getSeekerId)
                .distinct()
                .toList();

        // Batch fetch company details
        Map<UUID, SeekerDetailsResponse> seekerDetailsMap = getSeekerDetailsBatch(seekerIds);

        // Map to seeker list response with company details
        return consultations.map(consultation -> mapToCountryListResponse(
                consultation,
                seekerDetailsMap
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CountryCountResponse> getCountryCounts(Pageable pageable) {
        Page<Object[]> results = gatewayConsultationRepository.getCountriesWithCounts(pageable);
        return results.map(this::mapToCountryCountResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GatewayConsultationResponse> getConsultationsBySeekerAndStatus(UUID seekerId, String status, Pageable pageable) {
        GatewayConsultation.ConsultationStatus consultationStatus = GatewayConsultation.ConsultationStatus.valueOf(status.toUpperCase());
        return gatewayConsultationRepository.findBySeekerIdAndStatus(seekerId, consultationStatus, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public GatewayConsultationResponse updateConsultationStatus(UUID consultationId, String status) {
        GatewayConsultation consultation = gatewayConsultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", "id", consultationId));

        consultation.setStatus(GatewayConsultation.ConsultationStatus.valueOf(status.toUpperCase()));
        consultation = gatewayConsultationRepository.save(consultation);
        return mapToResponse(consultation);
    }

    @Override
    @Transactional
    public GatewayConsultationResponse updateConsultation(UUID consultationId, GatewayConsultationRequest request) {
        GatewayConsultation consultation = gatewayConsultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", "id", consultationId));

        consultation.setCountry(request.getCountry());
        consultation.setVisaRejection(request.getVisaRejection());
        consultation.setHasPassport(request.getHasPassport());

        consultation = gatewayConsultationRepository.save(consultation);
        return mapToResponse(consultation);
    }

    @Override
    public GatewayCountryCountResponse countConsultationsByCountry(String country) {

        long pending = gatewayConsultationRepository.countByCountryAndStatus(
                country,
                GatewayConsultation.ConsultationStatus.PENDING
        );
        long inReview = gatewayConsultationRepository.countByCountryAndStatus(
                country,
                GatewayConsultation.ConsultationStatus.REVIEW
        );
        long completed = gatewayConsultationRepository.countByCountryAndStatus(
                country,
                GatewayConsultation.ConsultationStatus.COMPLETED
        );
        long cancelled = gatewayConsultationRepository.countByCountryAndStatus(
                country,
                GatewayConsultation.ConsultationStatus.CANCELLED
        );

        return GatewayCountryCountResponse.builder()
                .pending(pending)
                .inReview(inReview)
                .completed(completed)
                .cancelled(cancelled)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public long countConsultationsBySeekerAndStatus(UUID seekerId, String status) {
        return gatewayConsultationRepository.countBySeekerIdAndStatus(seekerId,
                GatewayConsultation.ConsultationStatus.valueOf(status.toUpperCase()));
    }

    /**
     * Batch fetch seeker details for multiple companies
     */
    private Map<UUID, SeekerDetailsResponse> getSeekerDetailsBatch(List<UUID> seekerIds) {
        Map<UUID, SeekerDetailsResponse> result = new HashMap<>();

        if (seekerIds == null || seekerIds.isEmpty()) {
            return result;
        }

        try {
            ApiResponse<Map<UUID, SeekerDetailsResponse>> response = webClientBuilder.build()
                    .post()
                    .uri(userServiceUrl + "/api/v1/seeker/profiles/internal/batch")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(seekerIds)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<Map<UUID, SeekerDetailsResponse>>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                result.putAll(response.getData());
            }
        } catch (Exception e) {
            log.error("Failed to fetch seeker details in batch", e);
        }

        return result;
    }


    private GatewayConsultationResponse mapToResponse(GatewayConsultation consultation) {
        return GatewayConsultationResponse.builder()
                .id(consultation.getId())
                .seekerId(consultation.getSeekerId())
                .country(consultation.getCountry())
                .otherCountry(consultation.getCountry() != null && consultation.getCountry().equalsIgnoreCase("other")
                        ? consultation.getOtherCountry() : null)
                .studyField(consultation.getStudyField())
                .otherStudyField(consultation.getStudyField() != null && consultation.getStudyField().equalsIgnoreCase("other")
                        ? consultation.getOtherStudyField() : null)
                .studyLevel(consultation.getStudyLevel())
                .intake(consultation.getIntake())
                .universityType(consultation.getUniversityType())
                .languageTestStatus(consultation.getLanguageTestStatus())
                .budget(consultation.getBudget())
                .familySponsorship(consultation.getFamilySponsorship())
                .educationLoan(consultation.getEducationLoan())
                .visaRejection(consultation.getVisaRejection())
                .hasPassport(consultation.getHasPassport())
                .applyWithin(consultation.getApplyWithin())
                .status(consultation.getStatus())
                .createdAt(consultation.getCreatedAt())
                .updatedAt(consultation.getUpdatedAt())
                .build();
    }

    private GatewayConsultationCountryResponse mapToCountryListResponse(
            GatewayConsultation consultation,
            Map<UUID, SeekerDetailsResponse> seekerDetailsMap
    ) {
        if (consultation == null) {
            throw new BusinessException("Visa consultation cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

        // Get seeker details from the map
        SeekerDetailsResponse seeker = null;
        String seekerName = "Seeker";
        String seekerEmail = "";
        String seekerProfileUrl = "";
        String contactNo = "";

        if (seekerDetailsMap != null && seekerDetailsMap.containsKey(consultation.getSeekerId())) {
            seeker = seekerDetailsMap.get(consultation.getSeekerId());
            if (seeker != null && seeker.getFullName() != null) {
                seekerName = seeker.getFullName();
                seekerEmail = seeker.getEmail();
                seekerProfileUrl = seeker.getProfileUrl();
                contactNo = seeker.getContactNo();
            }
        }

        return GatewayConsultationCountryResponse.builder()
                .id(consultation.getId())
                .seekerId(consultation.getSeekerId())
                .seekerName(seekerName)
                .seekerEmail(seekerEmail)
                .seekerPhone(contactNo)
                .seekerProfileImage(seekerProfileUrl)
                .country(consultation.getCountry())
                .otherCountry(consultation.getCountry() != null && consultation.getCountry().equalsIgnoreCase("other")
                        ? consultation.getOtherCountry() : null)
                .studyField(consultation.getStudyField())
                .otherStudyField(consultation.getStudyField() != null && consultation.getStudyField().equalsIgnoreCase("other")
                        ? consultation.getOtherStudyField() : null)
                .studyLevel(consultation.getStudyLevel())
                .intake(consultation.getIntake())
                .universityType(consultation.getUniversityType())
                .languageTestStatus(consultation.getLanguageTestStatus())
                .budget(consultation.getBudget())
                .familySponsorship(consultation.getFamilySponsorship())
                .educationLoan(consultation.getEducationLoan())
                .visaRejection(consultation.getVisaRejection())
                .hasPassport(consultation.getHasPassport())
                .applyWithin(consultation.getApplyWithin())
                .status(consultation.getStatus())
                .createdAt(consultation.getCreatedAt())
                .updatedAt(consultation.getUpdatedAt())
                .build();
    }

    private CountryCountResponse mapToCountryCountResponse(Object[] row) {
        String country = (String) row[0];
        long count = ((Number) row[1]).longValue();

        return CountryCountResponse.builder()
                .country(country != null ? country : "Other")
                .count(count)
                .build();
    }
}