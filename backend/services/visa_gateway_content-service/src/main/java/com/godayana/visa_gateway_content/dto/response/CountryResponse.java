package com.godayana.visa_gateway_content.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CountryResponse {
    private UUID id;
    private String name;
    private String shortDescription;
    private String description;
    private String salary;
    private String visaType;
    private String imageKey;
    private String imageUrl;
    private Boolean isActive;
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}