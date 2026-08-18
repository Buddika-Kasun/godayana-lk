package com.godayana.visa_gateway_content.service.impl;

import com.godayana.dto.ApiResponse;
import com.godayana.dto.ApiResponseWrapper;
import com.godayana.dto.FileUploadResponse;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import com.godayana.exception.ResourceNotFoundException;
import com.godayana.visa_gateway_content.dto.request.VisaPostRequest;
import com.godayana.visa_gateway_content.dto.response.PostCountResponse;
import com.godayana.visa_gateway_content.dto.response.PostImageUploadResponse;
import com.godayana.visa_gateway_content.dto.response.VisaPostResponse;
import com.godayana.visa_gateway_content.entity.VisaPost;
import com.godayana.visa_gateway_content.repository.StoryRepository;
import com.godayana.visa_gateway_content.repository.VisaPostRepository;
import com.godayana.visa_gateway_content.service.interfaces.IVisaPostService;
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
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisaPostServiceImpl implements IVisaPostService {

    private final VisaPostRepository visaPostRepository;
    private final StoryRepository storyRepository;

    private final WebClient.Builder webClientBuilder;

    @Value("${FILE_SERVICE_URL}")
    private String fileServiceUrl;

    // ============ Public Methods ============

    @Override
    @Transactional(readOnly = true)
    public Page<VisaPostResponse> getActivePosts(Pageable pageable) {
        Page<VisaPost> posts = visaPostRepository.findActivePosts(pageable);

        // Batch fetch presigned URLs for all logo keys
        List<String> fileKeys = posts.stream()
                .map(VisaPost::getImage)
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        // Get all presigned URLs in one batch
        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        // Map to response with pagination
        return posts.map(post -> mapToListResponse(post, presignedUrlMap));
    }

//    @Override
//    @Transactional(readOnly = true)
//    public Page<VisaPostResponse> getActivePostsByCountry(String country, Pageable pageable) {
//        return visaPostRepository.findActivePostsByCountry(country, pageable)
//                .map(this::mapToResponse);
//    }

//    @Override
//    @Transactional(readOnly = true)
//    public Page<VisaPostResponse> getActivePostsByType(String type, Pageable pageable) {
//        return visaPostRepository.findActivePostsByType(type, pageable)
//                .map(this::mapToResponse);
//    }

//    @Override
//    @Transactional(readOnly = true)
//    public Page<VisaPostResponse> getActivePostsByCountryAndType(String country, String type, Pageable pageable) {
//        return visaPostRepository.findActivePostsByCountryAndType(country, type, pageable)
//                .map(this::mapToResponse);
//    }

//    @Override
//    @Transactional(readOnly = true)
//    public Page<VisaPostResponse> searchActivePosts(String keyword, Pageable pageable) {
//        return visaPostRepository.searchActivePosts(keyword, pageable)
//                .map(this::mapToResponse);
//    }

    @Override
    @Transactional(readOnly = true)
    public VisaPostResponse getActivePostById(UUID postId) {
        VisaPost post = visaPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Visa Post", "id", postId));

        if (!post.getIsActive()) {
            throw new BusinessException("Visa post is not active", ErrorCode.BUSINESS_ERROR.getCode(), 404);
        }

        return mapToResponse(post);
    }

//    @Override
//    @Transactional(readOnly = true)
//    public List<String> getAllActiveCountries() {
//        return visaPostRepository.findDistinctActiveCountries();
//    }

//    @Override
//    @Transactional(readOnly = true)
//    public List<String> getAllActiveTypes() {
//        return visaPostRepository.findDistinctActiveTypes();
//    }

//    @Override
//    @Transactional(readOnly = true)
//    public long countActiveByCountry(String country) {
//        return visaPostRepository.countActiveByCountry(country);
//    }

//    @Override
//    @Transactional(readOnly = true)
//    public long countActiveByType(String type) {
//        return visaPostRepository.countActiveByType(type);
//    }

    @Override
    @Transactional(readOnly = true)
    public PostCountResponse countActivePosts() {
        long visaCount = visaPostRepository.countActivePosts();
        long storyCount = storyRepository.count();
        long countryCount = 0;

        return PostCountResponse.builder()
                .visaCount(visaCount)
                .countryCount(countryCount)
                .storyCount(storyCount)
                .build();
    }

    // ============ Admin Methods ============

    @Override
    @Transactional
    public VisaPostResponse createPost(VisaPostRequest request, UUID adminId) {
        log.info("Creating visa post by admin: {}", adminId);

        VisaPost post = VisaPost.builder()
                .country(request.getCountry())
                .otherCountry("Other".equalsIgnoreCase(request.getCountry()) ? request.getOtherCountry() : null)
                .type(request.getType())
                .title(request.getTitle())
                .description(request.getDescription())
                .documents(request.getDocuments().toArray(new String[0]))
                .commonMistakes(request.getCommonMistakes().toArray(new String[0]))
                .cost(request.getCost())
                .processingTime(request.getProcessingTime())
                .image(request.getImage())
                .isActive(true)
                .createdBy(adminId)
                .build();

        post = visaPostRepository.save(post);
        return mapToResponse(post);
    }

    @Override
    @Transactional
    public VisaPostResponse updatePost(UUID postId, VisaPostRequest request, UUID adminId) {
        log.info("Updating visa post: {} by admin: {}", postId, adminId);

        VisaPost post = visaPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Visa Post", "id", postId));

        if (request.getCountry() != null) {
            post.setCountry(request.getCountry());
            post.setOtherCountry("Other".equalsIgnoreCase(request.getCountry()) ? request.getOtherCountry() : null);
        }
        if (request.getType() != null) {
            post.setType(request.getType());
        }
        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            post.setDescription(request.getDescription());
        }
        if (request.getDocuments() != null) {
            post.setDocuments(request.getDocuments().toArray(new String[0]));
        }
        if (request.getCommonMistakes() != null) {
            post.setCommonMistakes(request.getCommonMistakes().toArray(new String[0]));
        }
        if (request.getCost() != null) {
            post.setCost(request.getCost());
        }
        if (request.getProcessingTime() != null) {
            post.setProcessingTime(request.getProcessingTime());
        }
        if (request.getImage() != null) {
            post.setImage(request.getImage());
        }

        post.setUpdatedBy(adminId);
        post = visaPostRepository.save(post);
        return mapToResponse(post);
    }

    @Override
    @Transactional(readOnly = true)
    public VisaPostResponse getPostById(UUID postId) {
        VisaPost post = visaPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Visa Post", "id", postId));
        return mapToResponse(post);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VisaPostResponse> getAllPosts(Pageable pageable) {
        Page<VisaPost> posts = visaPostRepository.findAll(pageable);

        // Batch fetch presigned URLs for all logo keys
        List<String> fileKeys = posts.stream()
                .map(VisaPost::getImage)
                .filter(key -> key != null && !key.isEmpty())
                .distinct()
                .toList();

        // Get all presigned URLs in one batch
        Map<String, String> presignedUrlMap = getPresignedUrlsBatch(fileKeys);

        // Map to response with pagination
        return posts.map(post -> mapToListResponse(post, presignedUrlMap));
    }

    @Override
    @Transactional
    public void deletePost(UUID postId) {
        log.info("Deleting visa post: {}", postId);
        VisaPost post = visaPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Visa Post", "id", postId));
        visaPostRepository.delete(post);
    }

    @Override
    @Transactional
    public VisaPostResponse togglePostStatus(UUID postId, Boolean isActive, UUID adminId) {
        log.info("Toggling visa post: {} to active: {} by admin: {}", postId, isActive, adminId);

        VisaPost post = visaPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Visa Post", "id", postId));

        post.setIsActive(isActive);
        post.setUpdatedBy(adminId);
        post = visaPostRepository.save(post);
        return mapToResponse(post);
    }

    @Override
    @Transactional
    public PostImageUploadResponse uploadImage(UUID adminId, MultipartFile file) {
        log.info("Uploading visa post image for admin: {}", adminId);

        try {
            // Call file service to upload
            return uploadImageToFileService(file, "visa-post-image", adminId.toString());

        } catch (Exception e) {
            throw new BusinessException(
                    "Failed to upload post picture: " + e.getMessage(),
                    ErrorCode.INTERNAL_ERROR.getCode(),
                    HttpStatus.SC_INTERNAL_SERVER_ERROR
            );
        }
    }


    // ============ Private Methods ============

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


    private VisaPostResponse mapToResponse(VisaPost post) {

        String imageUrl = getPresignedUrlFromFileService(post.getImage());

        return VisaPostResponse.builder()
                .id(post.getId())
                .country(post.getCountry())
                .otherCountry(post.getOtherCountry())
                .type(post.getType())
                .title(post.getTitle())
                .description(post.getDescription())
                .documents(Arrays.asList(post.getDocuments()))
                .commonMistakes(Arrays.asList(post.getCommonMistakes()))
                .cost(post.getCost())
                .processingTime(post.getProcessingTime())
                .imageFileKey(post.getImage())
                .imageUrl(imageUrl)
                .isActive(post.getIsActive())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private VisaPostResponse mapToListResponse(VisaPost post, Map<String, String> images) {

        String imageUrl = null;

        if (images != null && images.containsKey(post.getImage())) {
            imageUrl = images.get(post.getImage());
        }

        return VisaPostResponse.builder()
                .id(post.getId())
                .country(post.getCountry())
                .otherCountry(post.getOtherCountry())
                .type(post.getType())
                .title(post.getTitle())
                .description(post.getDescription())
                .documents(Arrays.asList(post.getDocuments()))
                .commonMistakes(Arrays.asList(post.getCommonMistakes()))
                .cost(post.getCost())
                .processingTime(post.getProcessingTime())
                .imageFileKey(post.getImage())
                .imageUrl(imageUrl)
                .isActive(post.getIsActive())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}