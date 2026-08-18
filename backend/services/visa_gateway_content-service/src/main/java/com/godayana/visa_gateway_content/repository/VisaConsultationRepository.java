package com.godayana.visa_gateway_content.repository;

import com.godayana.visa_gateway_content.entity.VisaConsultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VisaConsultationRepository extends JpaRepository<VisaConsultation, UUID> {

    Page<VisaConsultation> findBySeekerId(UUID seekerId, Pageable pageable);

    @Query("SELECT vc FROM VisaConsultation vc WHERE " +
            "(:country IS NULL OR LOWER(vc.country) LIKE LOWER(CONCAT('%', :country, '%'))) AND " +
            "(:type IS NULL OR vc.type = :type) AND " +
            "(:status IS NULL OR vc.status = :status)")
    Page<VisaConsultation> findByCountryAndFilters(
            @Param("country") String country,
            @Param("type") VisaConsultation.VisaType type,
            @Param("status") VisaConsultation.ConsultationStatus status,
            Pageable pageable
    );

    Page<VisaConsultation> findBySeekerIdAndStatus(UUID seekerId, VisaConsultation.ConsultationStatus status, Pageable pageable);

    @Query("SELECT COUNT(vc) FROM VisaConsultation vc WHERE vc.seekerId = :seekerId")
    long countBySeekerId(@Param("seekerId") UUID seekerId);

    @Query("SELECT COUNT(vc) FROM VisaConsultation vc WHERE vc.seekerId = :seekerId AND vc.status = :status")
    long countBySeekerIdAndStatus(
            @Param("seekerId") UUID seekerId,
            @Param("status") VisaConsultation.ConsultationStatus status
    );

    @Query("SELECT vc FROM VisaConsultation vc WHERE vc.seekerId = :seekerId ORDER BY vc.createdAt DESC")
    Page<VisaConsultation> findRecentBySeekerId(@Param("seekerId") UUID seekerId, Pageable pageable);

    // ============ ADMIN COUNT METHODS ============

    /**
     * Count unique countries with "other" countries grouped together
     * Returns: long count of distinct countries (with "other" as one group)
     */
    @Query(value = """
        SELECT COUNT(DISTINCT 
            CASE 
                WHEN LOWER(country) LIKE 'other%' OR country IS NULL OR country = '' 
                THEN 'Other' 
                ELSE country 
            END)
        FROM visa_consultation
        """, nativeQuery = true)
    long countDistinctCountriesGrouped();

    /**
     * Get unique countries with their counts (grouped by country) - with pagination
     * Returns: Page of Object[] where [0] = country, [1] = count
     */
    @Query(value = """
    SELECT country_group, count FROM (
        SELECT 
            CASE 
                WHEN LOWER(country) LIKE 'other%' OR country IS NULL OR country = '' 
                THEN 'Other' 
                ELSE country 
            END AS country_group,
            COUNT(*) AS count
        FROM visa_consultation
        GROUP BY 
            CASE 
                WHEN LOWER(country) LIKE 'other%' OR country IS NULL OR country = '' 
                THEN 'Other' 
                ELSE country 
            END
    ) AS grouped
    ORDER BY 
        CASE WHEN country_group = 'Other' THEN 1 ELSE 0 END,
        count DESC
    """,
            countQuery = """
        SELECT COUNT(DISTINCT 
            CASE 
                WHEN LOWER(country) LIKE 'other%' OR country IS NULL OR country = '' 
                THEN 'Other' 
                ELSE country 
            END)
        FROM visa_consultation
        """,
            nativeQuery = true)
    Page<Object[]> getCountriesWithCounts(Pageable pageable);

    /**
     * Count consultations by country and type
     * Returns: count of consultations matching the country and type
     */
    @Query(value = """
        SELECT COUNT(*)
        FROM visa_consultation
        WHERE 
            CASE 
                WHEN LOWER(country) LIKE 'other%' OR country IS NULL OR country = '' 
                THEN 'Other' 
                ELSE country 
            END = :country
            AND (:type IS NULL OR type = :type)
        """, nativeQuery = true)
    long countByCountryAndType(
            @Param("country") String country,
            @Param("type") String type
    );

    /**
     * Count consultations by country, type, and status
     * Returns: count of consultations matching the country, type, and status
     */
    @Query(value = """
        SELECT COUNT(*)
        FROM visa_consultation
        WHERE 
            CASE 
                WHEN LOWER(country) LIKE 'other%' OR country IS NULL OR country = '' 
                THEN 'Other' 
                ELSE country 
            END = :country
            AND (:type IS NULL OR type = :type)
            AND (:status IS NULL OR status = :status)
        """, nativeQuery = true)
    long countByCountryAndTypeAndStatus(
            @Param("country") String country,
            @Param("type") String type,
            @Param("status") String status
    );

}