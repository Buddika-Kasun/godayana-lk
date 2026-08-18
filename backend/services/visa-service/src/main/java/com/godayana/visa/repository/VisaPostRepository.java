package com.godayana.visa.repository;

import com.godayana.visa.entity.VisaPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VisaPostRepository extends JpaRepository<VisaPost, UUID> {

    /**
     * Find active visa posts with pagination
     */
    @Query("SELECT vp FROM VisaPost vp WHERE vp.isActive = true")
    Page<VisaPost> findActivePosts(Pageable pageable);

    /**
     * Count active posts
     */
    @Query("SELECT COUNT(vp) FROM VisaPost vp WHERE vp.isActive = true")
    long countActivePosts();

//    /**
//     * Find active posts by country
//     */
//    @Query("SELECT vp FROM VisaPost vp WHERE vp.isActive = true AND LOWER(vp.country) = LOWER(:country)")
//    Page<VisaPost> findActivePostsByCountry(@Param("country") String country, Pageable pageable);
//
//    /**
//     * Find active posts by type
//     */
//    @Query("SELECT vp FROM VisaPost vp WHERE vp.isActive = true AND LOWER(vp.type) = LOWER(:type)")
//    Page<VisaPost> findActivePostsByType(@Param("type") String type, Pageable pageable);
//
//    /**
//     * Find active posts by country and type
//     */
//    @Query("SELECT vp FROM VisaPost vp WHERE vp.isActive = true AND LOWER(vp.country) = LOWER(:country) AND LOWER(vp.type) = LOWER(:type)")
//    Page<VisaPost> findActivePostsByCountryAndType(
//            @Param("country") String country,
//            @Param("type") String type,
//            Pageable pageable
//    );
//
//    /**
//     * Search active posts by keyword in title or description
//     */
//    @Query("SELECT vp FROM VisaPost vp WHERE vp.isActive = true AND (LOWER(vp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(vp.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
//    Page<VisaPost> searchActivePosts(@Param("keyword") String keyword, Pageable pageable);
//
//    /**
//     * Get all active countries
//     */
//    @Query("SELECT DISTINCT vp.country FROM VisaPost vp WHERE vp.isActive = true ORDER BY vp.country")
//    List<String> findDistinctActiveCountries();
//
//    /**
//     * Get all active types
//     */
//    @Query("SELECT DISTINCT vp.type FROM VisaPost vp WHERE vp.isActive = true ORDER BY vp.type")
//    List<String> findDistinctActiveTypes();
//
//    /**
//     * Count active posts by country
//     */
//    @Query("SELECT COUNT(vp) FROM VisaPost vp WHERE vp.isActive = true AND LOWER(vp.country) = LOWER(:country)")
//    long countActiveByCountry(@Param("country") String country);
//
//    /**
//     * Count active posts by type
//     */
//    @Query("SELECT COUNT(vp) FROM VisaPost vp WHERE vp.isActive = true AND LOWER(vp.type) = LOWER(:type)")
//    long countActiveByType(@Param("type") String type);
}