package com.godayana.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String registrationNumber;
    private String website;
    private String logoUrl;
    private String description;
    private String industry;
    private String companyType;
    private String employeeCount;
    private String location;

    @Email(message = "Invalid email format")
    private String companyEmail;

    private String hotlineNumber;
    private String facebookUrl;
    private String linkedinUrl;
    private String instagramUrl;

//    @NotBlank(message = "Contact person name is required")
    private String contactPersonName;

//    @NotBlank(message = "Designation is required")
    private String designation;

    @Email(message = "Invalid email format")
//    @NotBlank(message = "CV delivery email is required")
    private String cvDeliveryEmail;

    private Boolean jobPostingTerms;

    private Boolean cvDeliveryTerms;

}