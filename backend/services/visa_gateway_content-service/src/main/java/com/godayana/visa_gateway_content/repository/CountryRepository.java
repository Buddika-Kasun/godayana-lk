package com.godayana.visa_gateway_content.repository;

import com.godayana.visa_gateway_content.entity.Country;
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
public interface CountryRepository extends JpaRepository<Country, UUID> {

    Page<Country> findByIsActiveTrue(Pageable pageable);

    @Query("SELECT c FROM Country c WHERE c.isActive = true ORDER BY c.orderIndex ASC, c.name ASC")
    List<Country> findAllActiveOrdered();

    Page<Country> findByIsActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT c FROM Country c WHERE c.isActive = true AND LOWER(c.visaType) = LOWER(:visaType)")
    Page<Country> findByVisaType(@Param("visaType") String visaType, Pageable pageable);

    boolean existsByNameIgnoreCase(String name);

    @Modifying
    @Query("UPDATE Country c SET c.isActive = :isActive WHERE c.id = :id")
    void updateActiveStatus(@Param("id") UUID id, @Param("isActive") Boolean isActive);

    @Modifying
    @Query("UPDATE Country c SET c.orderIndex = :orderIndex WHERE c.id = :id")
    void updateOrderIndex(@Param("id") UUID id, @Param("orderIndex") Integer orderIndex);

    @Query("SELECT MAX(c.orderIndex) FROM Country c")
    Integer findMaxOrderIndex();
}