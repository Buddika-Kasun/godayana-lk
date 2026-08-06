package com.godayana.user.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeekerProfileSummary {

    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private String phone;
    private String profilePicUrl;
    private String resumeUrl;
    private Integer experienceYears;
}