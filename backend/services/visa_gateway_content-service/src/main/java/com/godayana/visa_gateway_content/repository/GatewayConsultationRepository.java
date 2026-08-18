package com.godayana.visa_gateway_content.repository;

import com.godayana.visa_gateway_content.entity.GatewayConsultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GatewayConsultationRepository extends JpaRepository<GatewayConsultation, UUID> {

    Page<GatewayConsultation> findBySeekerId(UUID seekerId, Pageable pageable);

    @Query("SELECT gc FROM GatewayConsultation gc WHERE " +
            "(:country IS NULL OR LOWER(gc.country) LIKE LOWER(CONCAT('%', :country, '%'))) AND " +
            "(:status IS NULL OR gc.status = :status)")
    Page<GatewayConsultation> findByCountryAndFilters(
            @Param("country") String country,
            @Param("status") GatewayConsultation.ConsultationStatus status,
            Pageable pageable
    );

    Page<GatewayConsultation> findBySeekerIdAndStatus(UUID seekerId, GatewayConsultation.ConsultationStatus status, Pageable pageable);

    @Query("SELECT COUNT(gc) FROM GatewayConsultation gc WHERE gc.seekerId = :seekerId")
    long countBySeekerId(@Param("seekerId") UUID seekerId);

    @Query("SELECT COUNT(gc) FROM GatewayConsultation gc WHERE gc.seekerId = :seekerId AND gc.status = :status")
    long countBySeekerIdAndStatus(
            @Param("seekerId") UUID seekerId,
            @Param("status") GatewayConsultation.ConsultationStatus status
    );

    @Query("SELECT gc FROM GatewayConsultation gc WHERE gc.seekerId = :seekerId ORDER BY gc.createdAt DESC")
    Page<GatewayConsultation> findRecentBySeekerId(@Param("seekerId") UUID seekerId, Pageable pageable);

    // ============ ADMIN COUNT METHODS ============

    /**
     * Count total distinct countries
     */
    @Query("SELECT COUNT(DISTINCT gc.country) FROM GatewayConsultation gc WHERE gc.country IS NOT NULL AND gc.country != ''")
    long countDistinctCountriesGrouped();

    /**
     * Get unique countries with their counts
     */
    @Query("SELECT gc.country, COUNT(gc) FROM GatewayConsultation gc WHERE gc.country IS NOT NULL AND gc.country != '' GROUP BY gc.country ORDER BY COUNT(gc) DESC")
    Page<Object[]> getCountriesWithCounts(Pageable pageable);

    /**
     * Count consultations by country
     */
    @Query("SELECT COUNT(gc) FROM GatewayConsultation gc WHERE gc.country = :country AND gc.status = :status")
    long countByCountryAndStatus(
            @Param("country") String country,
            @Param("status")  GatewayConsultation.ConsultationStatus status
    );

}