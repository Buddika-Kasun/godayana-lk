package com.godayana.visa_gateway_content.service.interfaces;

import com.godayana.visa_gateway_content.dto.request.VisaPostRequest;
import com.godayana.visa_gateway_content.dto.response.PostCountResponse;
import com.godayana.visa_gateway_content.dto.response.PostImageUploadResponse;
import com.godayana.visa_gateway_content.dto.response.VisaPostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface IVisaPostService {

    // ============ Public Methods ============

    Page<VisaPostResponse> getActivePosts(Pageable pageable);

//    Page<VisaPostResponse> getActivePostsByCountry(String country, Pageable pageable);

//    Page<VisaPostResponse> getActivePostsByType(String type, Pageable pageable);

//    Page<VisaPostResponse> getActivePostsByCountryAndType(String country, String type, Pageable pageable);

//    Page<VisaPostResponse> searchActivePosts(String keyword, Pageable pageable);

    VisaPostResponse getActivePostById(UUID postId);

//    List<String> getAllActiveCountries();

//    List<String> getAllActiveTypes();

//    long countActiveByCountry(String country);

//    long countActiveByType(String type);

    PostCountResponse countActivePosts();

    // ============ Admin Methods ============

    VisaPostResponse createPost(VisaPostRequest request, UUID adminId);

    VisaPostResponse updatePost(UUID postId, VisaPostRequest request, UUID adminId);

    VisaPostResponse getPostById(UUID postId);

    Page<VisaPostResponse> getAllPosts(Pageable pageable);

    void deletePost(UUID postId);

    VisaPostResponse togglePostStatus(UUID postId, Boolean isActive, UUID adminId);

    PostImageUploadResponse uploadImage(UUID companyId, MultipartFile file);

}