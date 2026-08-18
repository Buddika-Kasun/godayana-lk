package com.godayana.visa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisaPostResponse {
    private UUID id;
    private String country;
    private String otherCountry;
    private String type;
    private String title;
    private String description;
    private List<String> documents;
    private List<String> commonMistakes;
    private String cost;
    private String processingTime;
    private String imageUrl;
    private String imageFileKey;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}