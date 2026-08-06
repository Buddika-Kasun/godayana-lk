package com.godayana.course.repository;

import com.godayana.course.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Page<Review> findByCourseId(UUID courseId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.courseId = :courseId ORDER BY r.createdAt DESC")
    Page<Review> findByCourseIdOrderByCreatedAtDesc(UUID courseId, Pageable pageable);

    long countByCourseId(UUID courseId);

}