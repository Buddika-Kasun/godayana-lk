package com.godayana.visa_gateway_content.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostImageUploadResponse {
    private String fileKey;
    private String fileUrl;
}