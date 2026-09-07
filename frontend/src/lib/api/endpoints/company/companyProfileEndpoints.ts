// src/lib/api/companyEndpoints.ts
import { ApiResponse } from "@/types/apiResponse";
import { api } from "../../axios";

export interface CompanyProfileData {
  id?: string;
  userId?: string;
  companyName?: string;
  registrationNumber?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  companyType?: string;
  employeeCount?: number;
  location?: string;
  companyEmail?: string;
  hotlineNumber?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  contactPersonName?: string;
  designation?: string;
  cvDeliveryEmail?: string;
  jobPostingTerms?: boolean;
  cvDeliveryTerms?: boolean;
  isVerified?: boolean;
  isProfileComplete?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyCountsResponse {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const companyProfileAPI = {
  // Core profile operations

  getCompanyProfile: () =>
    api.get<ApiResponse<CompanyProfileData>>("/company/profiles/me"),

  updateCompanyProfile: (data: Partial<CompanyProfileData>) =>
    api.put<ApiResponse<CompanyProfileData>>("/company/profiles/me", data),

  deleteCompanyProfile: () =>
    api.delete<ApiResponse<void>>("/company/profiles/me"),

  // Logo upload (similar to seeker's uploadProfileImage)
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<ApiResponse<CompanyProfileData>>(
      "/company/profiles/me/logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};
