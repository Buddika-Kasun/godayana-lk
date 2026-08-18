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


// ==================== CONTENT API ====================

const contentAPI = {
  /**
   * Get all visa guides
   */
  getVisas: (params?: PostParams) =>
    api.get<ApiResponse<PaginatedResponse<VisaGuideResponse>>>(
      "/visa-posts/public",
      {
        params,
      },
    ),

  /**
   * Get visa guide by ID
   */
  getVisaById: (visaId: string) =>
    api.get<ApiResponse<VisaGuideResponse>>(`/visa-posts/public/${visaId}`),

};

export const contentEndpoints = {
  visa: contentAPI,
  county: "",
  story: "",
};

export default contentEndpoints;
