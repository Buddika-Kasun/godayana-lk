package com.godayana.visa_gateway_content.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisaPostRequest {

    @NotBlank(message = "Country is required")
    private String country;

    private String otherCountry;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotEmpty(message = "At least one document is required")
    private List<String> documents;

    @NotEmpty(message = "At least one common mistake is required")
    private List<String> commonMistakes;

    @NotBlank(message = "Cost is required")
    private String cost;

    @NotBlank(message = "Processing time is required")
    private String processingTime;

    private String image;
}