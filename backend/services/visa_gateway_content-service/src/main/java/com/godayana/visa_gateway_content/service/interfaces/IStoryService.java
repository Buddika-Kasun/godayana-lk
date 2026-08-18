package com.godayana.visa_gateway_content.service.interfaces;

import com.godayana.visa_gateway_content.dto.request.StoryRequest;
import com.godayana.visa_gateway_content.dto.response.PostImageUploadResponse;
import com.godayana.visa_gateway_content.dto.response.StoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface IStoryService {

    // ============ PUBLIC METHODS ============

    Page<StoryResponse> getPublishedStories(Pageable pageable);

//    Page<StoryResponse> getPublishedStoriesByType(String type, Pageable pageable);
//
//    Page<StoryResponse> getPublishedStoriesByCategory(String category, Pageable pageable);
//
//    Page<StoryResponse> getPublishedStoriesByTypeAndCategory(String type, String category, Pageable pageable);
//
//    StoryResponse getPublishedStoryById(UUID id);
//
//    Page<StoryResponse> searchPublishedStories(String keyword, Pageable pageable);
//
//    List<StoryResponse> getFeaturedStories();
//
//    List<String> getAllTypes();
//
//    List<String> getAllCategories();

    // ============ LIKE METHODS ============

    void likeStory(UUID id);

    void unlikeStory(UUID id);

    // ============ ADMIN METHODS ============

    StoryResponse createStory(StoryRequest request, UUID adminId);

    StoryResponse updateStory(UUID id, StoryRequest request, UUID adminId);

    StoryResponse getStoryById(UUID id);

    Page<StoryResponse> getAllStories(Pageable pageable);

    void deleteStory(UUID id);

    PostImageUploadResponse uploadStoryImage(UUID adminId, MultipartFile file);

    PostImageUploadResponse uploadStoryAvatar(UUID adminId, MultipartFile file);

//    StoryResponse togglePublishStatus(UUID id, Boolean isPublished, UUID adminId);
//
//    StoryResponse toggleFeatureStatus(UUID id, Boolean isFeatured, UUID adminId);
}