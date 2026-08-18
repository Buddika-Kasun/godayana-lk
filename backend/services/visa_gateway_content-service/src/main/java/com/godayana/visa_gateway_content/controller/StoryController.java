package com.godayana.visa_gateway_content.controller;

import com.godayana.dto.ApiResponse;
import com.godayana.visa_gateway_content.dto.request.StoryRequest;
import com.godayana.visa_gateway_content.dto.response.PostImageUploadResponse;
import com.godayana.visa_gateway_content.dto.response.StoryResponse;
import com.godayana.visa_gateway_content.service.interfaces.IStoryService;
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
@RequestMapping("/api/v1/stories")
@RequiredArgsConstructor
@Slf4j
public class StoryController {

    private final IStoryService storyService;

    // ============ PUBLIC ENDPOINTS ============

    @GetMapping("/public")
    public ApiResponse<Page<StoryResponse>> getPublishedStories(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Fetching published stories");
        return ApiResponse.success(storyService.getPublishedStories(pageable));
    }

//    @GetMapping("/public/type/{type}")
//    public ApiResponse<Page<StoryResponse>> getPublishedStoriesByType(
//            @PathVariable String type,
//            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
//        log.info("Fetching published stories by type: {}", type);
//        return ApiResponse.success(storyService.getPublishedStoriesByType(type, pageable));
//    }
//
//    @GetMapping("/public/category/{category}")
//    public ApiResponse<Page<StoryResponse>> getPublishedStoriesByCategory(
//            @PathVariable String category,
//            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
//        log.info("Fetching published stories by category: {}", category);
//        return ApiResponse.success(storyService.getPublishedStoriesByCategory(category, pageable));
//    }
//
//    @GetMapping("/public/search")
//    public ApiResponse<Page<StoryResponse>> searchPublishedStories(
//            @RequestParam String keyword,
//            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
//        log.info("Searching published stories with keyword: {}", keyword);
//        return ApiResponse.success(storyService.searchPublishedStories(keyword, pageable));
//    }
//
//    @GetMapping("/public/featured")
//    public ApiResponse<List<StoryResponse>> getFeaturedStories() {
//        log.info("Fetching featured stories");
//        return ApiResponse.success(storyService.getFeaturedStories());
//    }
//
//    @GetMapping("/public/types")
//    public ApiResponse<List<String>> getAllTypes() {
//        log.info("Fetching all story types");
//        return ApiResponse.success(storyService.getAllTypes());
//    }
//
//    @GetMapping("/public/categories")
//    public ApiResponse<List<String>> getAllCategories() {
//        log.info("Fetching all story categories");
//        return ApiResponse.success(storyService.getAllCategories());
//    }
//
//    @GetMapping("/public/{id}")
//    public ApiResponse<StoryResponse> getPublishedStoryById(@PathVariable UUID id) {
//        log.info("Fetching published story by id: {}", id);
//        return ApiResponse.success(storyService.getPublishedStoryById(id));
//    }

    // ============ LIKE ENDPOINTS ============

    @PostMapping("/{id}/like")
    public ApiResponse<Void> likeStory(@PathVariable UUID id) {
        log.info("Liking story: {}", id);
        storyService.likeStory(id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/like")
    public ApiResponse<Void> unlikeStory(@PathVariable UUID id) {
        log.info("Unliking story: {}", id);
        storyService.unlikeStory(id);
        return ApiResponse.success(null);
    }

    // ============ ADMIN ENDPOINTS ============

    @PostMapping("/admin")
    public ApiResponse<StoryResponse> createStory(
            @RequestHeader("X-User-Id") String adminId,
            @Valid @RequestBody StoryRequest request) {
        log.info("Creating story by admin: {}", adminId);
        return ApiResponse.success(storyService.createStory(request, UUID.fromString(adminId)));
    }

    @PutMapping("/admin/{id}")
    public ApiResponse<StoryResponse> updateStory(
            @RequestHeader("X-User-Id") String adminId,
            @PathVariable UUID id,
            @Valid @RequestBody StoryRequest request) {
        log.info("Updating story: {} by admin: {}", id, adminId);
        return ApiResponse.success(storyService.updateStory(id, request, UUID.fromString(adminId)));
    }

    @GetMapping("/admin")
    public ApiResponse<Page<StoryResponse>> getAllStories(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Fetching all stories for admin");
        return ApiResponse.success(storyService.getAllStories(pageable));
    }

    @GetMapping("/admin/{id}")
    public ApiResponse<StoryResponse> getStoryById(@PathVariable UUID id) {
        log.info("Fetching story by id for admin: {}", id);
        return ApiResponse.success(storyService.getStoryById(id));
    }

    @DeleteMapping("/admin/{id}")
    public ApiResponse<Void> deleteStory(@PathVariable UUID id) {
        log.info("Deleting story: {}", id);
        storyService.deleteStory(id);
        return ApiResponse.success(null);
    }

    @PostMapping("/admin/upload/story-image")
    public ApiResponse<PostImageUploadResponse> uploadStoryImage(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(storyService.uploadStoryImage(UUID.fromString(userId), file));
    }

    @PostMapping("/admin/upload/story-avatar")
    public ApiResponse<PostImageUploadResponse> uploadStoryAvatar(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam("file") MultipartFile file) {
        return ApiResponse.success(storyService.uploadStoryAvatar(UUID.fromString(userId), file));
    }

//    @PatchMapping("/admin/{id}/publish")
//    public ApiResponse<StoryResponse> togglePublishStatus(
//            @RequestHeader("X-User-Id") String adminId,
//            @PathVariable UUID id,
//            @RequestParam Boolean isPublished) {
//        log.info("Toggling publish status of story: {} to: {} by admin: {}", id, isPublished, adminId);
//        return ApiResponse.success(storyService.togglePublishStatus(id, isPublished, UUID.fromString(adminId)));
//    }
//
//    @PatchMapping("/admin/{id}/feature")
//    public ApiResponse<StoryResponse> toggleFeatureStatus(
//            @RequestHeader("X-User-Id") String adminId,
//            @PathVariable UUID id,
//            @RequestParam Boolean isFeatured) {
//        log.info("Toggling feature status of story: {} to: {} by admin: {}", id, isFeatured, adminId);
//        return ApiResponse.success(storyService.toggleFeatureStatus(id, isFeatured, UUID.fromString(adminId)));
//    }
}