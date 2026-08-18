package com.godayana.visa_gateway_content.service.impl;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.seeker.SeekerDetailsResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.visa_gateway_content.dto.request.VisaConsultationRequest;
import com.godayana.visa_gateway_content.dto.response.*;
import com.godayana.visa_gateway_content.entity.VisaConsultation;
import com.godayana.visa_gateway_content.repository.GatewayConsultationRepository;
import com.godayana.visa_gateway_content.repository.VisaConsultationRepository;
import com.godayana.visa_gateway_content.service.interfaces.IVisaConsultationService;
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
public class VisaConsultationServiceImpl implements IVisaConsultationService {

    private final VisaConsultationRepository visaConsultationRepository;
    private final GatewayConsultationRepository gatewayConsultationRepository;

    private final WebClient.Builder webClientBuilder;

    @Value("${USER_SERVICE_URL}")
    private String userServiceUrl;

    @Override
    @Transactional
    public VisaConsultationResponse createConsultation(UUID seekerId, VisaConsultationRequest request) {
        log.info("Creating visa consultation for seeker: {}", seekerId);

        VisaConsultation consultation = VisaConsultation.builder()
                .seekerId(seekerId)
                .type(request.getType())
                .country(request.getCountry())
                .visaRejection(request.getVisaRejection())
                .hasPassport(request.getHasPassport())
                .travelDate(request.getTravelDate())
                .note(request.getNote())
                .status(VisaConsultation.ConsultationStatus.PENDING)
                .build();

        consultation = visaConsultationRepository.save(consultation);
        return mapToResponse(consultation);
    }

    @Override
    @Transactional(readOnly = true)
    public VisaConsultationResponse getConsultationById(UUID consultationId) {
        VisaConsultation consultation = visaConsultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", "id", consultationId));
        return mapToResponse(consultation);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VisaConsultationResponse> getConsultationsBySeeker(UUID seekerId, Pageable pageable) {
        return visaConsultationRepository.findBySeekerId(seekerId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VisaConsultationCountryResponse> getConsultationsByCountryAndFilters(String country, String type, String status, Pageable pageable) {
        Page<VisaConsultation> consultations = visaConsultationRepository.findByCountryAndFilters(
                country,
                VisaConsultation.VisaType.valueOf(type),
                VisaConsultation.ConsultationStatus.valueOf(status),
                pageable
        );

        // Get all seeker IDs from the jobs
        List<UUID> seekerIds = consultations.getContent().stream()
                .map(VisaConsultation::getSeekerId)
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
        Page<Object[]> results = visaConsultationRepository.getCountriesWithCounts(pageable);
        return results.map(this::mapToCountryCountResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VisaConsultationResponse> getConsultationsBySeekerAndStatus(UUID seekerId, String status, Pageable pageable) {
        VisaConsultation.ConsultationStatus consultationStatus = VisaConsultation.ConsultationStatus.valueOf(status.toUpperCase());
        return visaConsultationRepository.findBySeekerIdAndStatus(seekerId, consultationStatus, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public VisaConsultationResponse updateConsultationStatus(UUID consultationId, String status) {
        VisaConsultation consultation = visaConsultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", "id", consultationId));

        consultation.setStatus(VisaConsultation.ConsultationStatus.valueOf(status.toUpperCase()));
        consultation = visaConsultationRepository.save(consultation);
        return mapToResponse(consultation);
    }

    @Override
    @Transactional
    public VisaConsultationResponse updateConsultation(UUID consultationId, VisaConsultationRequest request) {
        VisaConsultation consultation = visaConsultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", "id", consultationId));

        consultation.setType(request.getType());
        consultation.setCountry(request.getCountry());
        consultation.setVisaRejection(request.getVisaRejection());
        consultation.setHasPassport(request.getHasPassport());
        consultation.setTravelDate(request.getTravelDate());
        consultation.setNote(request.getNote());

        consultation = visaConsultationRepository.save(consultation);
        return mapToResponse(consultation);
    }

    @Override
    @Transactional(readOnly = true)
    public VisaGatewayCountResponse countConsultationsBySeeker(UUID seekerId) {
        long visaCount = visaConsultationRepository.countBySeekerId(seekerId);
        long gatewayCount = gatewayConsultationRepository.countBySeekerId(seekerId);

        return VisaGatewayCountResponse.builder()
                .visaCount(visaCount)
                .gatewayCount(gatewayCount)
                .build();
    }

    @Override
    public VisaGatewayCountResponse countConsultations() {
        long visaCount = visaConsultationRepository.countDistinctCountriesGrouped();
        long gatewayCount = gatewayConsultationRepository.countDistinctCountriesGrouped();

        return VisaGatewayCountResponse.builder()
                .visaCount(visaCount)
                .gatewayCount(gatewayCount)
                .build();
    }

    @Override
    public VisaCountryCountResponse countConsultationsByCountry(String country, String type) {

        long student = visaConsultationRepository.countByCountryAndType(
                country,
                VisaConsultation.VisaType.STUDENT.name()
        );
        long work = visaConsultationRepository.countByCountryAndType(
                country,
                VisaConsultation.VisaType.WORK.name()
        );
        long visit = visaConsultationRepository.countByCountryAndType(
                country,
                VisaConsultation.VisaType.VISIT.name()
        );
        long pending = visaConsultationRepository.countByCountryAndTypeAndStatus(
                country,
                VisaConsultation.VisaType.valueOf(type).name(),
                VisaConsultation.ConsultationStatus.PENDING.name()
        );
        long inReview = visaConsultationRepository.countByCountryAndTypeAndStatus(
                country,
                VisaConsultation.VisaType.valueOf(type).name(),
                VisaConsultation.ConsultationStatus.REVIEW.name()
        );
        long completed = visaConsultationRepository.countByCountryAndTypeAndStatus(
                country,
                VisaConsultation.VisaType.valueOf(type).name(),
                VisaConsultation.ConsultationStatus.COMPLETED.name()
        );
        long cancelled = visaConsultationRepository.countByCountryAndTypeAndStatus(
                country,
                VisaConsultation.VisaType.valueOf(type).name(),
                VisaConsultation.ConsultationStatus.CANCELLED.name()
        );

        return VisaCountryCountResponse.builder()
                .student(student)
                .work(work)
                .visit(visit)
                .pending(pending)
                .inReview(inReview)
                .completed(completed)
                .cancelled(cancelled)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public long countConsultationsBySeekerAndStatus(UUID seekerId, String status) {
        return visaConsultationRepository.countBySeekerIdAndStatus(seekerId,
                VisaConsultation.ConsultationStatus.valueOf(status.toUpperCase()));
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


    private VisaConsultationResponse mapToResponse(VisaConsultation consultation) {
        return VisaConsultationResponse.builder()
                .id(consultation.getId())
                .seekerId(consultation.getSeekerId())
                .type(consultation.getType())
                .country(consultation.getCountry())
                .visaRejection(consultation.getVisaRejection())
                .hasPassport(consultation.getHasPassport())
                .travelDate(consultation.getTravelDate())
                .note(consultation.getNote())
                .status(consultation.getStatus())
                .createdAt(consultation.getCreatedAt())
                .updatedAt(consultation.getUpdatedAt())
                .build();
    }

    private VisaConsultationCountryResponse mapToCountryListResponse(
            VisaConsultation consultation,
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

        return VisaConsultationCountryResponse.builder()
                .id(consultation.getId())
                .seekerId(consultation.getSeekerId())
                .seekerName(seekerName)
                .seekerEmail(seekerEmail)
                .seekerPhone(contactNo)
                .seekerProfileImage(seekerProfileUrl)
                .type(consultation.getType())
                .country(consultation.getCountry())
                .visaRejection(consultation.getVisaRejection())
                .hasPassport(consultation.getHasPassport())
                .travelDate(consultation.getTravelDate())
                .note(consultation.getNote())
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