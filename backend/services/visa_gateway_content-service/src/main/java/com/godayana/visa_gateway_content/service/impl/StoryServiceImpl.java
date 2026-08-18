package com.godayana.visa_gateway_content.service.impl;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.ApiResponseWrapper;
import com.godayana.dto.FileUploadResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.visa_gateway_content.dto.request.StoryRequest;
import com.godayana.visa_gateway_content.dto.response.PostImageUploadResponse;
import com.godayana.visa_gateway_content.dto.response.StoryResponse;
import com.godayana.visa_gateway_content.entity.Story;
import com.godayana.visa_gateway_content.entity.VisaPost;
import com.godayana.visa_gateway_content.repository.StoryRepository;
import com.godayana.visa_gateway_content.service.interfaces.IStoryService;
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
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoryServiceImpl implements IStoryService {

    private final StoryRepository storyRepository;

    private final WebClient.Builder webClientBuilder;

    @Value("${FILE_SERVICE_URL}")
    private String fileServiceUrl;

    // ============ PUBLIC METHODS ============

    @Override
    @Transactional(readOnly = true)
    public Page<StoryResponse> getPublishedStories(Pageable pageable) {
        Page<Story> stories =storyRepository.findAll(pageable);

        // Batch fetch presigned URLs for all image and avatar keys
        List<String> fileKeys = stories.getContent().stream()
                .flatMap(s -> Stream.of(s.getImageKey(), s.getAvatarKey()))
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        // Get all presigned URLs in one batch
        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        // Map to response with pagination
        return stories.map(post -> mapToListResponse(post, presignedUrlMap));
    }

//    @Override
//    @Transactional(readOnly = true)
//    public Page<StoryResponse> getPublishedStoriesByType(String type, Pageable pageable) {
//        return storyRepository.findByIsPublishedTrueAndType(type, pageable)
//                .map(this::mapToResponse);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<StoryResponse> getPublishedStoriesByCategory(String category, Pageable pageable) {
//        return storyRepository.findByIsPublishedTrueAndCategory(category, pageable)
//                .map(this::mapToResponse);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<StoryResponse> getPublishedStoriesByTypeAndCategory(String type, String category, Pageable pageable) {
//        return storyRepository.findByIsPublishedTrueAndTypeAndCategory(type, category, pageable)
//                .map(this::mapToResponse);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public StoryResponse getPublishedStoryById(UUID id) {
//        Story story = storyRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", id));
//
//        if (!story.getIsPublished()) {
//            throw new BusinessException("Story is not published", ErrorCode.BUSINESS_ERROR.getCode(), 404);
//        }
//
//        // Increment view count
//        storyRepository.incrementViewCount(id);
//
//        return mapToResponse(story);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<StoryResponse> searchPublishedStories(String keyword, Pageable pageable) {
//        return storyRepository.searchPublishedStories(keyword, pageable)
//                .map(this::mapToResponse);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<StoryResponse> getFeaturedStories() {
//        return storyRepository.findTop5ByIsPublishedTrueAndIsFeaturedTrueOrderByCreatedAtDesc()
//                .stream()
//                .map(this::mapToResponse)
//                .toList();
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<String> getAllTypes() {
//        return storyRepository.findDistinctTypes();
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<String> getAllCategories() {
//        return storyRepository.findDistinctCategories();
//    }

    // ============ LIKE METHODS ============

    @Override
    @Transactional
    public void likeStory(UUID id) {
        log.info("Liking story: {}", id);
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", id));

        storyRepository.incrementLikes(id);
//        story.setLikes(story.getLikes() + 1);
//
//        return mapToResponse(story);
    }

    @Override
    @Transactional
    public void unlikeStory(UUID id) {
        log.info("Unliking story: {}", id);
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", id));

        if (story.getLikes() > 0) {
            storyRepository.decrementLikes(id);
//            story.setLikes(story.getLikes() - 1);
        }

//        return mapToResponse(story);
    }

    // ============ ADMIN METHODS ============

    @Override
    @Transactional
    public StoryResponse createStory(StoryRequest request, UUID adminId) {
        log.info("Creating story by admin: {}", adminId);

        Story story = Story.builder()
                .type(request.getType())
                .title(request.getTitle())
                .description(request.getDescription())
                .author(request.getAuthor())
                .authorRole(request.getAuthorRole())
                .authorLocation(request.getAuthorLocation())
                .category(request.getCategory())
                .imageKey(request.getImageKey())
                .avatarKey(request.getAvatarKey())
                .likes(0)
                .build();

        story = storyRepository.save(story);
        return mapToResponse(story);
    }

    @Override
    @Transactional
    public StoryResponse updateStory(UUID id, StoryRequest request, UUID adminId) {
        log.info("Updating story: {} by admin: {}", id, adminId);

        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", id));

        if (request.getType() != null) {
            story.setType(request.getType());
        }
        if (request.getTitle() != null) {
            story.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            story.setDescription(request.getDescription());
        }
        if (request.getAuthor() != null) {
            story.setAuthor(request.getAuthor());
        }
        if (request.getAuthorRole() != null) {
            story.setAuthorRole(request.getAuthorRole());
        }
        if (request.getAuthorLocation() != null) {
            story.setAuthorLocation(request.getAuthorLocation());
        }
        if (request.getCategory() != null) {
            story.setCategory(request.getCategory());
        }
        if (request.getImageKey() != null) {
            story.setImageKey(request.getImageKey());
        }
        if (request.getAvatarKey() != null) {
            story.setAvatarKey(request.getAvatarKey());
        }

        story = storyRepository.save(story);
        return mapToResponse(story);
    }

    @Override
    @Transactional(readOnly = true)
    public StoryResponse getStoryById(UUID id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", id));
        return mapToResponse(story);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StoryResponse> getAllStories(Pageable pageable) {
        Page<Story> stories =storyRepository.findAll(pageable);

        // Batch fetch presigned URLs for all image and avatar keys
        List<String> fileKeys = stories.getContent().stream()
                .flatMap(s -> Stream.of(s.getImageKey(), s.getAvatarKey()))
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        // Get all presigned URLs in one batch
        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        // Map to response with pagination
        return stories.map(post -> mapToListResponse(post, presignedUrlMap));
    }

    @Override
    @Transactional
    public void deleteStory(UUID id) {
        log.info("Deleting story: {}", id);
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", id));
        storyRepository.delete(story);
    }

    @Override
    @Transactional
    public PostImageUploadResponse uploadStoryImage(UUID adminId, MultipartFile file) {
        log.info("Uploading story image for admin: {}", adminId);

        try {
            // Call file service to upload
            return uploadImageToFileService(file, "story-image", adminId.toString());

        } catch (Exception e) {
            throw new BusinessException(
                    "Failed to upload post picture: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    @Override
    @Transactional
    public PostImageUploadResponse uploadStoryAvatar(UUID adminId, MultipartFile file) {
        log.info("Uploading story avatar for admin: {}", adminId);

        try {
            // Call file service to upload
            return uploadImageToFileService(file, "story-avatar", adminId.toString());

        } catch (Exception e) {
            throw new BusinessException(
                    "Failed to upload post picture: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

//    @Override
//    @Transactional
//    public StoryResponse togglePublishStatus(UUID id, Boolean isPublished, UUID adminId) {
//        log.info("Toggling publish status of story: {} to: {} by admin: {}", id, isPublished, adminId);
//
//        Story story = storyRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", id));
//
//        story.setIsPublished(isPublished);
//        if (isPublished) {
//            story.setPublishedAt(LocalDateTime.now());
//        }
//        story.setUpdatedBy(adminId);
//        story = storyRepository.save(story);
//        return mapToResponse(story);
//    }
//
//    @Override
//    @Transactional
//    public StoryResponse toggleFeatureStatus(UUID id, Boolean isFeatured, UUID adminId) {
//        log.info("Toggling feature status of story: {} to: {} by admin: {}", id, isFeatured, adminId);
//
//        Story story = storyRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Story", "id", id));
//
//        story.setIsFeatured(isFeatured);
//        story.setUpdatedBy(adminId);
//        story = storyRepository.save(story);
//        return mapToResponse(story);
//    }

    // ============ PRIVATE METHODS ============

    private PostImageUploadResponse uploadImageToFileService(MultipartFile file, String folder, String userId) {
        try {
            // Create multipart body
            MultiValueMap<String, Object> multipartBody = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            multipartBody.add("file", resource);

            // Use INTERNAL endpoint - this doesn't require X-User-Id header
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
                log.error("Response from file service is null");
                throw new BusinessException(
                        "No response from file service",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            if (!responseWrapper.getSuccess()) {
                log.error("File service returned error: {}", responseWrapper.getMessage());
                throw new BusinessException(
                        "File service error: " + responseWrapper.getMessage(),
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            FileUploadResponse data = responseWrapper.getData();
            if (data == null) {
                log.error("File service response data is null");
                throw new BusinessException(
                        "No data in file service response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            String fileKey = data.getFileKey();
            String fileUrl = data.getFileUrl();

            log.info("File uploaded successfully. FileId: {}, FileUrl: {}",
                    data.getFileId(), fileKey);

            if (fileKey == null || fileKey.isEmpty()) {
                throw new BusinessException(
                        "File URL not found in response",
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        HttpStatus.SC_INTERNAL_SERVER_ERROR
                );
            }

            return PostImageUploadResponse.builder()
                    .fileKey(fileKey)
                    .fileUrl(fileUrl)
                    .build();

        } catch (IOException e) {
            log.error("Failed to read file bytes", e);
            throw new BusinessException(
                    "Failed to read file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        } catch (Exception e) {
            log.error("Failed to upload file to file service", e);
            throw new BusinessException(
                    "Failed to upload file: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    private String getPresignedUrlFromFileService(String fileKey) {
        if (fileKey == null || fileKey.isEmpty()) {
            return null;
        }

        try {
            Map<String, String> requestBody = Map.of("fileKey", fileKey);

            // Use ParameterizedTypeReference for generic response
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

            log.warn("Failed to get presigned URL for file key: {}, message: {}",
                    fileKey, response != null ? response.getMessage() : "Unknown error");
            return null;
        } catch (Exception e) {
            log.error("Failed to get presigned URL for file key: {}", fileKey, e);
            return null;
        }
    }

    private Map<String, String> getPresignedUrlsBatch(List<String> fileKeys) {
        Map<String, String> result = new HashMap<>();

        if (fileKeys == null || fileKeys.isEmpty()) {
            return result;
        }

        try {
            // Call file service batch endpoint
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
            } else {
                log.warn("Failed to get batch presigned URLs: {}", response != null ? response.getMessage() : "Unknown error");
            }
        } catch (Exception e) {
            log.error("Failed to get batch presigned URLs", e);
        }

        return result;
    }

    private StoryResponse mapToResponse(Story story) {

        String imageUrl = getPresignedUrlFromFileService(story.getImageKey());
        String avatarUrl = getPresignedUrlFromFileService(story.getAvatarKey());

        return StoryResponse.builder()
                .id(story.getId())
                .type(story.getType())
                .title(story.getTitle())
                .description(story.getDescription())
                .author(story.getAuthor())
                .authorRole(story.getAuthorRole())
                .authorLocation(story.getAuthorLocation())
                .category(story.getCategory())
                .likes(story.getLikes())
                .imageKey(story.getImageKey())
                .imageUrl(imageUrl)
                .avatarKey(story.getAvatarKey())
                .avatarUrl(avatarUrl)
                .createdAt(story.getCreatedAt())
                .updatedAt(story.getUpdatedAt())
                .build();
    }

    private StoryResponse mapToListResponse(Story story, Map<String, String> images) {

        String imageUrl = null;
        String avatarUrl = null;

        if (images != null && images.containsKey(story.getImageKey())) {
            imageUrl = images.get(story.getImageKey());
        }
        if (images != null && images.containsKey(story.getAvatarKey())) {
            avatarUrl = images.get(story.getAvatarKey());
        }

        return StoryResponse.builder()
                .id(story.getId())
                .type(story.getType())
                .title(story.getTitle())
                .description(story.getDescription())
                .author(story.getAuthor())
                .authorRole(story.getAuthorRole())
                .authorLocation(story.getAuthorLocation())
                .category(story.getCategory())
                .likes(story.getLikes())
                .imageKey(story.getImageKey())
                .imageUrl(imageUrl)
                .avatarKey(story.getAvatarKey())
                .avatarUrl(avatarUrl)
                .createdAt(story.getCreatedAt())
                .updatedAt(story.getUpdatedAt())
                .build();
    }
}