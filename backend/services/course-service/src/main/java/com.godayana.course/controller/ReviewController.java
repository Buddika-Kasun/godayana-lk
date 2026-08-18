package com.godayana.course.controller;

import com.godayana.course.dto.request.ReviewRequest;
import com.godayana.course.dto.response.*;
import com.godayana.course.service.interfaces.IReviewService;
import com.godayana.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {

    private final IReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody ReviewRequest request) {
        log.info("Creating review for user: {}", userId);
        return ApiResponse.success(reviewService.createReview(UUID.fromString(userId), request));
    }

    @GetMapping("/course/{courseId}")
    public ApiResponse<Page<ReviewResponse>> getReviewsByCourse(
            @PathVariable UUID courseId,
            Pageable pageable) {
        log.info("Fetching reviews for course: {}", courseId);
        return ApiResponse.success(reviewService.getReviewsByCourse(courseId, pageable));
    }

    @GetMapping("/course/counts/{courseId}")
    public ApiResponse<Long> getReviewCounts(
            @PathVariable UUID courseId
    ) {
        log.info("Getting review counts for course: {}", courseId);
        return ApiResponse.success(reviewService.getReviewCounts(courseId));
    }

}