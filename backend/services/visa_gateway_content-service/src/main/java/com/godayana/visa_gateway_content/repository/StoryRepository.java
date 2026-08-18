package com.godayana.visa_gateway_content.repository;

import com.godayana.visa_gateway_content.entity.Story;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StoryRepository extends JpaRepository<Story, UUID> {

//    Page<Story> findByIsPublishedTrue(Pageable pageable);
//
//    Page<Story> findByIsPublishedTrueAndType(String type, Pageable pageable);
//
//    Page<Story> findByIsPublishedTrueAndCategory(String category, Pageable pageable);
//
//    Page<Story> findByIsPublishedTrueAndTypeAndCategory(String type, String category, Pageable pageable);
//
//    List<Story> findTop5ByIsPublishedTrueAndIsFeaturedTrueOrderByCreatedAtDesc();
//
//    @Query("SELECT s FROM Story s WHERE s.isPublished = true AND (LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
//    Page<Story> searchPublishedStories(@Param("keyword") String keyword, Pageable pageable);
//
//    @Query("SELECT DISTINCT s.type FROM Story s WHERE s.isPublished = true ORDER BY s.type")
//    List<String> findDistinctTypes();
//
//    @Query("SELECT DISTINCT s.category FROM Story s WHERE s.isPublished = true ORDER BY s.category")
//    List<String> findDistinctCategories();
//
//    @Modifying
//    @Query("UPDATE Story s SET s.viewCount = s.viewCount + 1 WHERE s.id = :id")
//    void incrementViewCount(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Story s SET s.likes = s.likes + 1 WHERE s.id = :id")
    void incrementLikes(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Story s SET s.likes = s.likes - 1 WHERE s.id = :id AND s.likes > 0")
    void decrementLikes(@Param("id") UUID id);
}