package com.godayana.user.repository;

import com.godayana.user.entity.CompanyProfile;
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
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, UUID> {
    Optional<CompanyProfile> findByUserId(UUID userId);

    @Query("SELECT c FROM CompanyProfile c WHERE c.userId IN :userIds")
    List<CompanyProfile> findAllByUserIdIn(@Param("userIds") List<UUID> userIds);

    Optional<CompanyProfile> findByCompanyNameIgnoreCase(String companyName);

    Page<CompanyProfile> findByStatus(CompanyProfile.CompanyStatus status, Pageable pageable);

    @Query("SELECT c FROM CompanyProfile c WHERE " +
            "(:search IS NULL OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.industry) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.location) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:industry IS NULL OR LOWER(c.industry) = LOWER(:industry)) AND " +
            "(:status IS NULL OR c.status = :status) AND " +
            "(:isVerified IS NULL OR c.isVerified = :isVerified) AND " +
            "(:createdAfter IS NULL OR c.createdAt >= :createdAfter) AND " +
            "(:createdBefore IS NULL OR c.createdAt <= :createdBefore)")
    Page<CompanyProfile> searchCompanies(
            @Param("search") String search,
            @Param("status") CompanyProfile.CompanyStatus status,
            @Param("industry") String industry,
            @Param("isVerified") Boolean isVerified,
            @Param("createdAfter") LocalDateTime createdAfter,
            @Param("createdBefore") LocalDateTime createdBefore,
            Pageable pageable
    );

    @Query(value = "SELECT * FROM company_profiles c WHERE " +
            "(CAST(:search AS text) IS NULL OR " +
            "c.company_name ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
            "c.description ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
            "c.industry ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
            "c.location ILIKE CONCAT('%', CAST(:search AS text), '%')) AND " +
            "(CAST(:industry AS text) IS NULL OR c.industry ILIKE CONCAT('%', CAST(:industry AS text), '%')) AND " +
            "(CAST(:status AS text) IS NULL OR c.status = CAST(:status AS text)) AND " +
            "(CAST(:isVerified AS boolean) IS NULL OR c.is_verified = CAST(:isVerified AS boolean)) AND " +
            "(CAST(:createdAfter AS timestamp) IS NULL OR c.created_at >= CAST(:createdAfter AS timestamp)) AND " +
            "(CAST(:createdBefore AS timestamp) IS NULL OR c.created_at <= CAST(:createdBefore AS timestamp))",
            countQuery = "SELECT COUNT(*) FROM company_profiles c WHERE " +
                    "(CAST(:search AS text) IS NULL OR " +
                    "c.company_name ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
                    "c.description ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
                    "c.industry ILIKE CONCAT('%', CAST(:search AS text), '%') OR " +
                    "c.location ILIKE CONCAT('%', CAST(:search AS text), '%')) AND " +
                    "(CAST(:industry AS text) IS NULL OR c.industry ILIKE CONCAT('%', CAST(:industry AS text), '%')) AND " +
                    "(CAST(:status AS text) IS NULL OR c.status = CAST(:status AS text)) AND " +
                    "(CAST(:isVerified AS boolean) IS NULL OR c.is_verified = CAST(:isVerified AS boolean)) AND " +
                    "(CAST(:createdAfter AS timestamp) IS NULL OR c.created_at >= CAST(:createdAfter AS timestamp)) AND " +
                    "(CAST(:createdBefore AS timestamp) IS NULL OR c.created_at <= CAST(:createdBefore AS timestamp))",
            nativeQuery = true)
    Page<CompanyProfile> searchCompaniesNative(
            @Param("search") String search,
            @Param("status") String status,
            @Param("industry") String industry,
            @Param("isVerified") Boolean isVerified,
            @Param("createdAfter") LocalDateTime createdAfter,
            @Param("createdBefore") LocalDateTime createdBefore,
            Pageable pageable
    );

    @Query("SELECT c FROM CompanyProfile c WHERE c.status = 'APPROVED' AND c.isVerified = :isVerified")
    Page<CompanyProfile> findByVerification(boolean isVerified, Pageable pageable);

    List<CompanyProfile> findByIsVerifiedFalse();

    boolean existsByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM CompanyProfile c WHERE c.userId = :userId")
    void deleteByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("UPDATE CompanyProfile c SET c.status = :status WHERE c.userId = :userId")
    void updateStatusByUserId(UUID userId, CompanyProfile.CompanyStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE CompanyProfile c SET c.isVerified = :verified WHERE c.userId = :userId")
    void updateVerificationStatus(UUID userId, Boolean verified);

    @Query("SELECT COUNT(c) FROM CompanyProfile c")
    long countAll();

    @Query("SELECT COUNT(c) FROM CompanyProfile c WHERE c.status = :status")
    long countByStatus(@Param("status") CompanyProfile.CompanyStatus status);

    @Query("SELECT COUNT(c) FROM CompanyProfile c WHERE c.status = 'APPROVED' AND c.isVerified = :isVerified")
    long countApprovedByActivation(@Param("isVerified") boolean isVerified);

}