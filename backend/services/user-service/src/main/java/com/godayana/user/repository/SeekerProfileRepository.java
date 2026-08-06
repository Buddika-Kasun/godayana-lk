package com.godayana.user.repository;

import com.godayana.user.dto.SeekerProfileSummary;
import com.godayana.user.entity.CompanyProfile;
import com.godayana.user.entity.SeekerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, UUID> {
    Optional<SeekerProfile> findByUserId(UUID userId);

    @Query("SELECT new com.godayana.user.dto.SeekerProfileSummary(" +
            "s.id, s.userId, s.fullName, s.email, s.phone, s.profilePicUrl,s.resumeUrl, s.experienceYears) " +
            "FROM SeekerProfile s WHERE s.userId IN :userIds")
    List<SeekerProfileSummary> findAllByUserIdIn(@Param("userIds") List<UUID> userIds);

    boolean existsByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM SeekerProfile s WHERE s.userId = :userId")
    void deleteByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("UPDATE SeekerProfile s SET s.shareCv = :shareCv WHERE s.userId = :userId")
    void updateShareCvStatus(UUID userId, Boolean shareCv);

    @Query("SELECT COUNT(s) FROM SeekerProfile s WHERE s.status = :status")
    long countByStatus(@Param("status") SeekerProfile.ProfileStatus status);

    Page<SeekerProfile> findByStatus(SeekerProfile.ProfileStatus status, Pageable pageable);

    @Query("SELECT s FROM SeekerProfile s WHERE s.status = 'APPROVED' AND s.isActive = :isActive")
    Page<SeekerProfile> findByActivation(boolean isActive, Pageable pageable);

    @Query("SELECT COUNT(s) FROM SeekerProfile s WHERE s.status = 'APPROVED' AND s.isActive = :isActive")
    long countApprovedByActivation(@Param("isActive") boolean isActive);

    @Query(value = "SELECT * FROM seeker_profiles s WHERE " +
            "(CAST(:search AS text) IS NULL OR " +
            "s.full_name ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
            "s.email ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
            "s.phone ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
            "s.current_job_title ILIKE CONCAT('%', CAST(:search AS text), '%')) AND " +
            "(CAST(:status AS text) IS NULL OR s.status = CAST(:status AS text)) AND " +
            "(CAST(:location AS text) IS NULL OR s.location ILIKE CONCAT('%', CAST(:location AS text), '%')) AND " +
            "(CAST(:isActive AS boolean) IS NULL OR s.is_active = CAST(:isActive AS boolean)) AND " +
            "(CAST(:gender AS text) IS NULL OR s.gender ILIKE CAST(:gender AS text)) AND " +
            "(CAST(:educationLevel AS text) IS NULL OR s.education ILIKE CONCAT('%', CAST(:educationLevel AS text), '%')) AND " +
            "(CAST(:minExperience AS integer) IS NULL OR s.experience_years >= CAST(:minExperience AS integer)) AND " +
            "(CAST(:maxExperience AS integer) IS NULL OR s.experience_years <= CAST(:maxExperience AS integer)) AND " +
            "(CAST(:createdAfter AS timestamp) IS NULL OR s.created_at >= CAST(:createdAfter AS timestamp)) AND " +
            "(CAST(:createdBefore AS timestamp) IS NULL OR s.created_at <= CAST(:createdBefore AS timestamp))",
            countQuery = "SELECT COUNT(*) FROM seeker_profiles s WHERE " +
                    "(CAST(:search AS text) IS NULL OR " +
                    "s.full_name ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
                    "s.email ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
                    "s.phone ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
                    "s.current_job_title ILIKE CONCAT('%', CAST(:search AS text), '%')) AND " +
                    "(CAST(:status AS text) IS NULL OR s.status = CAST(:status AS text)) AND " +
                    "(CAST(:location AS text) IS NULL OR s.location ILIKE CONCAT('%', CAST(:location AS text), '%')) AND " +
                    "(CAST(:isActive AS boolean) IS NULL OR s.is_active = CAST(:isActive AS boolean)) AND " +
                    "(CAST(:gender AS text) IS NULL OR s.gender ILIKE CAST(:gender AS text)) AND " +
                    "(CAST(:educationLevel AS text) IS NULL OR s.education ILIKE CONCAT('%', CAST(:educationLevel AS text), '%')) AND " +
                    "(CAST(:minExperience AS integer) IS NULL OR s.experience_years >= CAST(:minExperience AS integer)) AND " +
                    "(CAST(:maxExperience AS integer) IS NULL OR s.experience_years <= CAST(:maxExperience AS integer)) AND " +
                    "(CAST(:createdAfter AS timestamp) IS NULL OR s.created_at >= CAST(:createdAfter AS timestamp)) AND " +
                    "(CAST(:createdBefore AS timestamp) IS NULL OR s.created_at <= CAST(:createdBefore AS timestamp))",
            nativeQuery = true)
    Page<SeekerProfile> searchSeekersNative(
            @Param("search") String search,
            @Param("status") String status,
            @Param("location") String location,
            @Param("isActive") Boolean isActive,
            @Param("gender") String gender,
            @Param("educationLevel") String educationLevel,
            @Param("minExperience") Integer minExperience,
            @Param("maxExperience") Integer maxExperience,
            @Param("createdAfter") LocalDateTime createdAfter,
            @Param("createdBefore") LocalDateTime createdBefore,
            Pageable pageable
    );
}