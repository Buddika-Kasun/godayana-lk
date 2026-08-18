// src/lib/api/endpoints/admin/adminContentEndpoints.ts
import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";

// ==================== TYPES ====================

export interface VisaGuideResponse {
  id: string;
  country: string;
  otherCountry?: string;
  type: string;
  title: string;
  description: string;
  documents: string[];
  commonMistakes: string[];
  cost: string;
  processingTime: string;
  imageUrl?: string;
  imageFileKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisaGuideRequest {
  country: string;
  otherCountry?: string;
  type: string;
  title: string;
  description: string;
  documents: string[];
  commonMistakes: string[];
  cost: string;
  processingTime: string;
  image: string;
}

export interface PostParams {
    page?: number;
    size?: number;
}

export interface ImageUploadResponse {
  fileKey: string;
  fileUrl: string;
}

export interface PostCountsResponse {
  visaCount: number;
  countryCount: number;
  storyCount: number;
}

// ==================== CONTENT API ====================

const adminContentAPI = {
  getPostCounts: () =>
    api.get<ApiResponse<PostCountsResponse>>("/visa-posts/admin/counts"),

  /**
   * Get all visa guides
   */
  getVisas: (params?: PostParams) =>
    api.get<ApiResponse<PaginatedResponse<VisaGuideResponse>>>(
      "/visa-posts/admin",
      {
        params,
      },
    ),

  /**
   * Get visa guide by ID
   */
  getVisaById: (visaId: string) =>
    api.get<ApiResponse<VisaGuideResponse>>(`/visa-posts/admin/${visaId}`),

  /**
   * Create a new visa guide
   */
  createVisa: (data: VisaGuideRequest) =>
    api.post<ApiResponse<VisaGuideResponse>>("/visa-posts/admin", data),

  /**
   * Update a visa guide
   */
  updateVisa: (visaId: string, data: Partial<VisaGuideRequest>) =>
    api.put<ApiResponse<VisaGuideResponse>>(
      `/visa-posts/admin/${visaId}`,
      data,
    ),

  /**
   * Delete a visa guide
   */
  deleteVisa: (visaId: string) =>
    api.delete<ApiResponse<void>>(`/visa-posts/admin/${visaId}`),

  /**
   * Upload image for visa guide
   */
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<ImageUploadResponse>>(
      "/visa-posts/admin/upload/visa-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};

export const adminContentEndpoints = {
  visa: adminContentAPI,
  county: "",
  story: "",
};

export default adminContentEndpoints;
