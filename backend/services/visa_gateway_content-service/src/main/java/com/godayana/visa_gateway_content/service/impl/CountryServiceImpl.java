package com.godayana.visa_gateway_content.service.impl;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.ApiResponseWrapper;
import com.godayana.dto.FileUploadResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.visa_gateway_content.dto.request.CountryRequest;
import com.godayana.visa_gateway_content.dto.response.CountryResponse;
import com.godayana.visa_gateway_content.dto.response.PostImageUploadResponse;
import com.godayana.visa_gateway_content.entity.Country;
import com.godayana.visa_gateway_content.repository.CountryRepository;
import com.godayana.visa_gateway_content.service.interfaces.ICountryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CountryServiceImpl implements ICountryService {

    private final CountryRepository countryRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${FILE_SERVICE_URL}")
    private String fileServiceUrl;

    // ============ PUBLIC METHODS ============

    @Override
    @Transactional(readOnly = true)
    public Page<CountryResponse> getActiveCountries(Pageable pageable) {
        Page<Country> countries = countryRepository.findByIsActiveTrue(pageable);

        List<String> fileKeys = countries.getContent().stream()
                .map(Country::getImageKey)
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        return countries.map(country -> mapToResponse(country, presignedUrlMap));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CountryResponse> getActiveCountriesOrdered() {
        List<Country> countries = countryRepository.findAllActiveOrdered();

        List<String> fileKeys = countries.stream()
                .map(Country::getImageKey)
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        return countries.stream()
                .map(country -> mapToResponse(country, presignedUrlMap))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CountryResponse> getActiveCountriesByName(String name, Pageable pageable) {
        Page<Country> countries = countryRepository.findByIsActiveTrueAndNameContainingIgnoreCase(name, pageable);

        List<String> fileKeys = countries.getContent().stream()
                .map(Country::getImageKey)
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        return countries.map(country -> mapToResponse(country, presignedUrlMap));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CountryResponse> getActiveCountriesByVisaType(String visaType, Pageable pageable) {
        Page<Country> countries = countryRepository.findByVisaType(visaType, pageable);

        List<String> fileKeys = countries.getContent().stream()
                .map(Country::getImageKey)
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        return countries.map(country -> mapToResponse(country, presignedUrlMap));
    }

    @Override
    @Transactional(readOnly = true)
    public CountryResponse getActiveCountryById(UUID id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));

        if (!country.getIsActive()) {
            throw new BusinessException("Country is not active", ErrorCode.BUSINESS_ERROR.getCode(), 404);
        }

        return mapToResponse(country);
    }

    // ============ ADMIN METHODS ============

    @Override
    @Transactional
    public CountryResponse createCountry(CountryRequest request, UUID adminId) {
        log.info("Creating country by admin: {}", adminId);

        if (countryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BusinessException(
                    "Country with name '" + request.getName() + "' already exists",
                    ErrorCode.DUPLICATE_RESOURCE.getCode(),
                    HttpStatus.SC_CONFLICT
            );
        }

        Integer maxOrder = countryRepository.findMaxOrderIndex();
        Integer orderIndex = maxOrder != null ? maxOrder + 1 : 0;

        Country country = Country.builder()
                .name(request.getName())
                .shortDescription(request.getShortDescription())
                .description(request.getDescription())
                .salary(request.getSalary())
                .visaType(request.getVisaType())
                .imageKey(request.getImageKey())
                .isActive(true)
                .orderIndex(orderIndex)
                .createdBy(adminId)
                .build();

        country = countryRepository.save(country);
        return mapToResponse(country);
    }

    @Override
    @Transactional
    public CountryResponse updateCountry(UUID id, CountryRequest request, UUID adminId) {
        log.info("Updating country: {} by admin: {}", id, adminId);

        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));

        if (request.getName() != null) {
            if (!country.getName().equalsIgnoreCase(request.getName()) &&
                    countryRepository.existsByNameIgnoreCase(request.getName())) {
                throw new BusinessException(
                        "Country with name '" + request.getName() + "' already exists",
                        ErrorCode.DUPLICATE_RESOURCE.getCode(),
                        HttpStatus.SC_CONFLICT
                );
            }
            country.setName(request.getName());
        }

        if (request.getShortDescription() != null) {
            country.setShortDescription(request.getShortDescription());
        }
        if (request.getDescription() != null) {
            country.setDescription(request.getDescription());
        }
        if (request.getSalary() != null) {
            country.setSalary(request.getSalary());
        }
        if (request.getVisaType() != null) {
            country.setVisaType(request.getVisaType());
        }
        if (request.getImageKey() != null) {
            country.setImageKey(request.getImageKey());
        }
//        if (request.getIsActive() != null) {
//            country.setIsActive(request.getIsActive());
//        }
//        if (request.getOrderIndex() != null) {
//            country.setOrderIndex(request.getOrderIndex());
//        }

        country.setUpdatedBy(adminId);
        country = countryRepository.save(country);
        return mapToResponse(country);
    }

    @Override
    @Transactional(readOnly = true)
    public CountryResponse getCountryById(UUID id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));
        return mapToResponse(country);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CountryResponse> getAllCountries(Pageable pageable) {
        Page<Country> countries = countryRepository.findAll(pageable);

        List<String> fileKeys = countries.getContent().stream()
                .map(Country::getImageKey)
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        return countries.map(country -> mapToResponse(country, presignedUrlMap));
    }

    @Override
    @Transactional
    public void deleteCountry(UUID id) {
        log.info("Deleting country: {}", id);
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));
        countryRepository.delete(country);
    }

    @Override
    @Transactional
    public CountryResponse toggleCountryStatus(UUID id, Boolean isActive, UUID adminId) {
        log.info("Toggling country: {} to active: {} by admin: {}", id, isActive, adminId);

        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));

        country.setIsActive(isActive);
        country.setUpdatedBy(adminId);
        country = countryRepository.save(country);
        return mapToResponse(country);
    }

    @Override
    @Transactional
    public CountryResponse reorderCountry(UUID id, Integer orderIndex, UUID adminId) {
        log.info("Reordering country: {} to index: {} by admin: {}", id, orderIndex, adminId);

        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));

        country.setOrderIndex(orderIndex);
        country.setUpdatedBy(adminId);
        country = countryRepository.save(country);
        return mapToResponse(country);
    }

    @Override
    @Transactional
    public PostImageUploadResponse uploadCountryImage(UUID adminId, MultipartFile file) {
        log.info("Uploading country image for admin: {}", adminId);

        try {
            return uploadImageToFileService(file, "country-image", adminId.toString());
        } catch (Exception e) {
            throw new BusinessException(
                    "Failed to upload country image: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    // ============ PRIVATE METHODS ============

    private PostImageUploadResponse uploadImageToFileService(MultipartFile file, String folder, String userId) {
        try {
            MultiValueMap<String, Object> multipartBody = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            multipartBody.add("file", resource);

            String internalUrl = fileServiceUrl + "/api/v1/files/internal/upload?folder=" + folder + "&userId=" + userId;

            ApiResponseWrapper<FileUploadResponse> responseWrapper = webClientBuilder.build()
                    .post()
                    .uri(internalUrl)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(multipartBody))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponseWrapper<FileUploadResponse>>() {})
                    .block();

            if (responseWrapper == null) {
                throw new BusinessException(
                        "No response from file service",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            if (!responseWrapper.getSuccess()) {
                throw new BusinessException(
                        "File service error: " + responseWrapper.getMessage(),
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            FileUploadResponse data = responseWrapper.getData();
            if (data == null) {
                throw new BusinessException(
                        "No data in file service response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            return PostImageUploadResponse.builder()
                    .fileKey(data.getFileKey())
                    .fileUrl(data.getFileUrl())
                    .build();

        } catch (IOException e) {
            log.error("Failed to read file bytes", e);
            throw new BusinessException(
                    "Failed to read file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private Map<String, String> getPresignedUrlsBatch(List<String> fileKeys) {
        Map<String, String> result = new HashMap<>();

        if (fileKeys == null || fileKeys.isEmpty()) {
            return result;
        }

        try {
            ApiResponse<Map<String, String>> response = webClientBuilder.build()
                    .post()
                    .uri(fileServiceUrl + "/api/v1/files/internal/presigned-urls/batch")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(fileKeys)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<Map<String, String>>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                result.putAll(response.getData());
            }
        } catch (Exception e) {
            log.error("Failed to get batch presigned URLs", e);
        }

        return result;
    }

    private CountryResponse mapToResponse(Country country) {
        Map<String, String> presignedUrlMap = new HashMap<>();
        if (country.getImageKey() != null && !country.getImageKey().isEmpty()) {
            String imageUrl = getPresignedUrlFromFileService(country.getImageKey());
            if (imageUrl != null) {
                presignedUrlMap.put(country.getImageKey(), imageUrl);
            }
        }
        return mapToResponse(country, presignedUrlMap);
    }

    private CountryResponse mapToResponse(Country country, Map<String, String> presignedUrlMap) {
        String imageUrl = null;
        if (country.getImageKey() != null && !country.getImageKey().isEmpty()) {
            imageUrl = presignedUrlMap.get(country.getImageKey());
        }

        return CountryResponse.builder()
                .id(country.getId())
                .name(country.getName())
                .shortDescription(country.getShortDescription())
                .description(country.getDescription())
                .salary(country.getSalary())
                .visaType(country.getVisaType())
                .imageKey(country.getImageKey())
                .imageUrl(imageUrl)
                .isActive(country.getIsActive())
                .orderIndex(country.getOrderIndex())
                .createdAt(country.getCreatedAt())
                .updatedAt(country.getUpdatedAt())
                .build();
    }

    private String getPresignedUrlFromFileService(String fileKey) {
        if (fileKey == null || fileKey.isEmpty()) {
            return null;
        }

        try {
            Map<String, String> requestBody = Map.of("fileKey", fileKey);

            ApiResponse<String> response = webClientBuilder.build()
                    .post()
                    .uri(fileServiceUrl + "/api/v1/files/internal/presigned-url")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<String>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }
            return null;
        } catch (Exception e) {
            log.error("Failed to get presigned URL for file key: {}", fileKey, e);
            return null;
        }
    }
}