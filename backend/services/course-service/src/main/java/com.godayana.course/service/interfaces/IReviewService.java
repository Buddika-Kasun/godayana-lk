package com.godayana.course.service.interfaces;

import com.godayana.course.dto.request.ReviewRequest;
import com.godayana.course.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IReviewService {

    ReviewResponse createReview(UUID userId, ReviewRequest request);

    Page<ReviewResponse> getReviewsByCourse(UUID courseId, Pageable pageable);

    long getReviewCounts(UUID courseId);

}