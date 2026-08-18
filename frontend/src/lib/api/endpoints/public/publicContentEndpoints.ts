// src/lib/api/endpoints/public/publicContentEndpoints.ts
import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { StoryResponse } from "../admin/adminContentEndpoints";

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

const visaContentAPI = {
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

const storyContentAPI = {
  /**
   * Get all stories
   */
  getStories: (params?: PostParams) =>
    api.get<ApiResponse<PaginatedResponse<StoryResponse>>>("/stories/public",
      {
        params
      }
    ),

  likeStory: (storyId: string) =>
    api.post<ApiResponse<void>>(`/stories/${storyId}/like`),

  unlikeStory: (storyId: string) =>
    api.delete<ApiResponse<void>>(`/stories/${storyId}/like`),
};

const contentEndpoints = {
  visa: visaContentAPI,
  county: "",
  story: storyContentAPI,
};

export default contentEndpoints;
