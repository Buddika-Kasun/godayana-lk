package com.godayana.otp.repository;

import com.godayana.otp.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpRepository extends JpaRepository<OtpCode, UUID> {
    Optional<OtpCode> findTopByIdentifierAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
            String identifier, String purpose);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM OtpCode o WHERE o.expiresAt < :now")
    void deleteExpiredOtps(LocalDateTime now);

    @Modifying
    @Query("DELETE FROM OtpCode o WHERE o.identifier = :identifier AND o.purpose = :purpose AND o.verified = false")
    void deleteExpiredOtpsForIdentifier(
            @Param("identifier") String identifier,
            @Param("purpose") String purpose
    );
}