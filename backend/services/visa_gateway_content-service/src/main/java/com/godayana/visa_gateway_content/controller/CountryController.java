package com.godayana.visa_gateway_content.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.visa_gateway_content.dto.request.CountryRequest;
import com.godayana.visa_gateway_content.dto.response.CountryResponse;
import com.godayana.visa_gateway_content.dto.response.PostImageUploadResponse;
import com.godayana.visa_gateway_content.service.interfaces.ICountryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/countries")
@RequiredArgsConstructor
@Slf4j
public class CountryController {

    private final ICountryService countryService;

    // ============ PUBLIC ENDPOINTS ============

    @GetMapping("/public")
    public ApiResponse<Page<CountryResponse>> getActiveCountries(
            @PageableDefault(size = 30, sort = "orderIndex", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Fetching active countries");
        return ApiResponse.success(countryService.getActiveCountries(pageable));
    }

    @GetMapping("/public/ordered")
    public ApiResponse<List<CountryResponse>> getActiveCountriesOrdered() {
        log.info("Fetching active countries ordered");
        return ApiResponse.success(countryService.getActiveCountriesOrdered());
    }

    @GetMapping("/public/search")
    public ApiResponse<Page<CountryResponse>> searchActiveCountries(
            @RequestParam String name,
            @PageableDefault(size = 10) Pageable pageable) {
        log.info("Searching active countries by name: {}", name);
        return ApiResponse.success(countryService.getActiveCountriesByName(name, pageable));
    }

    @GetMapping("/public/visa-type/{visaType}")
    public ApiResponse<Page<CountryResponse>> getActiveCountriesByVisaType(
            @PathVariable String visaType,
            @PageableDefault(size = 10) Pageable pageable) {
        log.info("Fetching active countries by visa type: {}", visaType);
        return ApiResponse.success(countryService.getActiveCountriesByVisaType(visaType, pageable));
    }

    @GetMapping("/public/{id}")
    public ApiResponse<CountryResponse> getActiveCountryById(@PathVariable UUID id) {
        log.info("Fetching active country by id: {}", id);
        return ApiResponse.success(countryService.getActiveCountryById(id));
    }

    // ============ ADMIN ENDPOINTS ============

    @PostMapping("/admin")
    public ApiResponse<CountryResponse> createCountry(
            @RequestHeader("X-User-Id") String adminId,
            @Valid @RequestBody CountryRequest request) {
        log.info("Creating country by admin: {}", adminId);
        return ApiResponse.success(countryService.createCountry(request, UUID.fromString(adminId)));
    }

    @PutMapping("/admin/{id}")
    public ApiResponse<CountryResponse> updateCountry(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID id,
            @Valid @RequestBody CountryRequest request) {
        log.info("Updating country: {} by admin: {}", id, adminId);
        return ApiResponse.success(countryService.updateCountry(id, request, UUID.fromString(adminId)));
    }

    @GetMapping("/admin")
    public ApiResponse<Page<CountryResponse>> getAllCountries(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Fetching all countries for admin");
        return ApiResponse.success(countryService.getAllCountries(pageable));
    }

    @GetMapping("/admin/{id}")
    public ApiResponse<CountryResponse> getCountryById(@PathVariable UUID id) {
        log.info("Fetching country by id for admin: {}", id);
        return ApiResponse.success(countryService.getCountryById(id));
    }

    @DeleteMapping("/admin/{id}")
    public ApiResponse<Void> deleteCountry(@PathVariable UUID id) {
        log.info("Deleting country: {}", id);
        countryService.deleteCountry(id);
        return ApiResponse.success(null);
    }

    @PatchMapping("/admin/{id}/toggle-status")
    public ApiResponse<CountryResponse> toggleCountryStatus(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID id,
            @RequestParam Boolean isActive) {
        log.info("Toggling country: {} to active: {} by admin: {}", id, isActive, adminId);
        return ApiResponse.success(countryService.toggleCountryStatus(id, isActive, UUID.fromString(adminId)));
    }

    @PatchMapping("/admin/{id}/reorder")
    public ApiResponse<CountryResponse> reorderCountry(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID id,
            @RequestParam Integer orderIndex) {
        log.info("Reordering country: {} to index: {} by admin: {}", id, orderIndex, adminId);
        return ApiResponse.success(countryService.reorderCountry(id, orderIndex, UUID.fromString(adminId)));
    }

    @PostMapping("/admin/upload/country-image")
    public ApiResponse<PostImageUploadResponse> uploadCountryImage(
            @RequestHeader("X-User-Id") String adminId,
            @RequestParam("file") MultipartFile file) {
        log.info("Uploading country image by admin: {}", adminId);
        return ApiResponse.success(countryService.uploadCountryImage(UUID.fromString(adminId), file));
    }
}