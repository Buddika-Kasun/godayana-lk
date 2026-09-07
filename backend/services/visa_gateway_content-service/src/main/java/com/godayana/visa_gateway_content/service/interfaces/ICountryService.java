package com.godayana.visa_gateway_content.service.interfaces;

import com.godayana.visa_gateway_content.dto.request.CountryRequest;
import com.godayana.visa_gateway_content.dto.response.CountryResponse;
import com.godayana.visa_gateway_content.dto.response.PostImageUploadResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ICountryService {

    // ============ PUBLIC METHODS ============

    Page<CountryResponse> getActiveCountries(Pageable pageable);

    List<CountryResponse> getActiveCountriesOrdered();

    Page<CountryResponse> getActiveCountriesByName(String name, Pageable pageable);

    Page<CountryResponse> getActiveCountriesByVisaType(String visaType, Pageable pageable);

    CountryResponse getActiveCountryById(UUID id);

    // ============ ADMIN METHODS ============

    CountryResponse createCountry(CountryRequest request, UUID adminId);

    CountryResponse updateCountry(UUID id, CountryRequest request, UUID adminId);

    CountryResponse getCountryById(UUID id);

    Page<CountryResponse> getAllCountries(Pageable pageable);

    void deleteCountry(UUID id);

    CountryResponse toggleCountryStatus(UUID id, Boolean isActive, UUID adminId);

    CountryResponse reorderCountry(UUID id, Integer orderIndex, UUID adminId);

    PostImageUploadResponse uploadCountryImage(UUID adminId, MultipartFile file);
}