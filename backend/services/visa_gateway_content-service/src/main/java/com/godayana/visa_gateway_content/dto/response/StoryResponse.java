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
public class StoryResponse {
    private UUID id;
    private String type;
    private String title;
    private String description;
    private String author;
    private String authorRole;
    private String authorLocation;
    private String category;
    private Integer likes;
    private String imageKey;
    private String imageUrl;
    private String avatarKey;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}