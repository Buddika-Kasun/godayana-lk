package com.godayana.visa_gateway_content.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CountryRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String shortDescription;
    private String description;
    private String salary;
    private String visaType;
    private String imageKey;
}