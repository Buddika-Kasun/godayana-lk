package com.godayana.user.dto.response;

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
public class AdminSeekerProfileResponse {
    private UUID userId;
    private String name;
    private String profileImageUrl;
    private String contactNo;
    private long appliedCount;
    private long enrolledCount;
    private String status;
    private boolean activation;
    private LocalDateTime createdAt;
}