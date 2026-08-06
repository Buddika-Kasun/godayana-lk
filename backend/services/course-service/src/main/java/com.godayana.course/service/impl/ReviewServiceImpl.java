package com.godayana.course.service.impl;

import com.godayana.course.dto.request.ReviewRequest;
import com.godayana.course.dto.response.*;
import com.godayana.course.entity.Review;
import com.godayana.course.repository.ReviewRepository;
import com.godayana.course.service.interfaces.IReviewService;
import com.godayana.dto.ApiResponse;
import com.godayana.dto.UserNameAvatar;
import com.godayana.exception.BusinessException;
import com.godayana.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;

    private final WebClient.Builder webClientBuilder;

    @Value("${USER_SERVICE_URL}")
    private String userServiceUrl;

    @Override
    @Transactional
    public ReviewResponse createReview(UUID userId, ReviewRequest request) {
        log.info("Creating review for user: {}", userId);

        Review review = Review.builder()
                .userId(userId)
                .courseId(request.getCourseId())
                .comment(request.getComment())
                .rating(request.getRating())
                .build();

        review = reviewRepository.save(review);
        log.info("Review created with ID: {}", review.getId());

        return mapToResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByCourse(UUID courseId, Pageable pageable) {
            return reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId, pageable)
                    .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long getReviewCounts(UUID courseId) {
        log.debug("Getting review counts for course: {}", courseId);

        long total = reviewRepository.countByCourseId(courseId);

        return total;
    }

    private UserNameAvatar getUserNameAndAvatar(UUID userId) {
        if (userId == null) {
            return null;
        }

        try {
            ApiResponse<UserNameAvatar> response = webClientBuilder.build()
                    .get()
                    .uri(userServiceUrl + "/api/v1/common/profiles/internal/name-avatar/{userId}", userId)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<UserNameAvatar>>() {})
                    .block();

            if (response != null && response.isSuccess() && response.getData() != null) {
                UserNameAvatar user = response.getData();
                log.debug("Fetched user details for ID: {}, Name: {}", userId, user.getName());
                return user;
            }

            log.warn("Failed to get company for ID: {}", userId);
            return null;

        } catch (Exception e) {
            log.error("Error fetching company name for ID: {}", userId, e);
            return null;
        }
    }

    private ReviewResponse mapToResponse(Review review) {
        if (review == null) {
            throw new BusinessException("Review cannot be null", ErrorCode.INVALID_INPUT.getCode(), 400);
        }

//        long hoursAgo = calculateHoursAgo(review.getCreatedAt());

        UserNameAvatar user = getUserNameAndAvatar(review.getUserId());

        return ReviewResponse.builder()
                .id(review.getId())
                .courseId(review.getCourseId())
                .userName(user.getName())
                .userAvatar(user.getAvatarUrl())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

}