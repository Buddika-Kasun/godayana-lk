package com.godayana.visa.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.visa.dto.request.VisaPostRequest;
import com.godayana.visa.dto.response.PostCountResponse;
import com.godayana.visa.dto.response.PostImageUploadResponse;
import com.godayana.visa.dto.response.VisaPostResponse;
import com.godayana.visa.service.interfaces.IVisaPostService;
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
@RequestMapping("/api/v1/visa-posts")
@RequiredArgsConstructor
@Slf4j
public class VisaPostController {

    private final IVisaPostService visaPostService;

    // ============ Public Endpoints ============

    @GetMapping("/public")
    public ApiResponse<Page<VisaPostResponse>> getActivePosts(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Fetching active visa posts");
        return ApiResponse.success(visaPostService.getActivePosts(pageable));
    }

//    @GetMapping("/public/country/{country}")
//    public ApiResponse<Page<VisaPostResponse>> getActivePostsByCountry(
//            @PathVariable String country,
//            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
//        log.info("Fetching active visa posts for country: {}", country);
//        return ApiResponse.success(visaPostService.getActivePostsByCountry(country, pageable));
//    }

//    @GetMapping("/public/type/{type}")
//    public ApiResponse<Page<VisaPostResponse>> getActivePostsByType(
//            @PathVariable String type,
//            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
//        log.info("Fetching active visa posts for type: {}", type);
//        return ApiResponse.success(visaPostService.getActivePostsByType(type, pageable));
//    }

//    @GetMapping("/public/search")
//    public ApiResponse<Page<VisaPostResponse>> searchActivePosts(
//            @RequestParam String keyword,
//            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
//        log.info("Searching active visa posts with keyword: {}", keyword);
//        return ApiResponse.success(visaPostService.searchActivePosts(keyword, pageable));
//    }

//    @GetMapping("/public/countries")
//    public ApiResponse<List<String>> getActiveCountries() {
//        log.info("Fetching all active countries");
//        return ApiResponse.success(visaPostService.getAllActiveCountries());
//    }

//    @GetMapping("/public/types")
//    public ApiResponse<List<String>> getActiveTypes() {
//        log.info("Fetching all active types");
//        return ApiResponse.success(visaPostService.getAllActiveTypes());
//    }

    @GetMapping("/public/{postId}")
    public ApiResponse<VisaPostResponse> getActivePostById(@PathVariable UUID postId) {
        log.info("Fetching active visa post by id: {}", postId);
        return ApiResponse.success(visaPostService.getActivePostById(postId));
    }

//    @GetMapping("/public/count/country/{country}")
//    public ApiResponse<Long> countActiveByCountry(@PathVariable String country) {
//        log.info("Counting active visa posts for country: {}", country);
//        return ApiResponse.success(visaPostService.countActiveByCountry(country));
//    }

//    @GetMapping("/public/count/type/{type}")
//    public ApiResponse<Long> countActiveByType(@PathVariable String type) {
//        log.info("Counting active visa posts for type: {}", type);
//        return ApiResponse.success(visaPostService.countActiveByType(type));
//    }


    // ============ Admin Endpoints ============

    @GetMapping("/admin/counts")
    public ApiResponse<PostCountResponse> countActivePosts() {
        log.info("Counting active visa posts");
        return ApiResponse.success(visaPostService.countActivePosts());
    }

    @PostMapping("/admin")
    public ApiResponse<VisaPostResponse> createPost(
            @RequestHeader("X-User-Id") String adminId,
            @Valid @RequestBody VisaPostRequest request) {
        log.info("Creating visa post by admin: {}", adminId);
        return ApiResponse.success(visaPostService.createPost(request, UUID.fromString(adminId)));
    }

    @PutMapping("/admin/{postId}")
    public ApiResponse<VisaPostResponse> updatePost(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID postId,
            @Valid @RequestBody VisaPostRequest request) {
        log.info("Updating visa post: {} by admin: {}", postId, adminId);
        return ApiResponse.success(visaPostService.updatePost(postId, request, UUID.fromString(adminId)));
    }

    @GetMapping("/admin")
    public ApiResponse<Page<VisaPostResponse>> getAllPosts(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Fetching all visa posts for admin");
        return ApiResponse.success(visaPostService.getAllPosts(pageable));
    }

    @GetMapping("/admin/{postId}")
    public ApiResponse<VisaPostResponse> getPostById(@PathVariable UUID postId) {
        log.info("Fetching visa post by id for admin: {}", postId);
        return ApiResponse.success(visaPostService.getPostById(postId));
    }

    @DeleteMapping("/admin/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable UUID postId) {
        log.info("Deleting visa post: {}", postId);
        visaPostService.deletePost(postId);
        return ApiResponse.success(null);
    }

    @PatchMapping("/admin/{postId}/toggle-status")
    public ApiResponse<VisaPostResponse> togglePostStatus(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID postId,
            @RequestParam Boolean isActive) {
        log.info("Toggling visa post: {} to active: {} by admin: {}", postId, isActive, adminId);
        return ApiResponse.success(visaPostService.togglePostStatus(postId, isActive, UUID.fromString(adminId)));
    }

    @PostMapping("/admin/upload/visa-image")
    public ApiResponse<PostImageUploadResponse> uploadVisaPostImage(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(visaPostService.uploadImage(UUID.fromString(userId), file));
    }
}