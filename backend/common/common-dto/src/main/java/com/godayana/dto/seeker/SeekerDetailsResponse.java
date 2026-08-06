package com.godayana.dto.seeker;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeekerDetailsResponse {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String profileUrl;
    private String cvUrl;
    private String email;
    private String gender;
    private String education;
    private String studyField;
    private String contactNo;
    private Integer experience;
}