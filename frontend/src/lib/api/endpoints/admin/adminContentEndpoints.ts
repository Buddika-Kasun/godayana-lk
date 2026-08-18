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

export interface StoryResponse {
  id: string;
  type: string;
  title: string;
  description: string;
  author: string;
  authorRole: string;
  authorLocation: string;
  category: string;
  likes: number;
  imageUrl?: string;
  imageKey?: string;
  avatarUrl?: string;
  avatarKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoryRequest {
  type: string;
  title: string;
  description: string;
  author: string;
  authorRole: string;
  authorLocation: string;
  category: string;
  imageKey: string;
  avatarKey: string;
}

export interface CountryResponse {
  id: string;
  name: string;
  otherCountry?: string;
  shortDescription: string;
  description: string;
  salary: string;
  visaType: string;
  imageUrl?: string;
  imageKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CountryRequest {
  name: string;
  shortDescription: string;
  description: string;
  salary: string;
  visaType: string;
  imageKey: string;
}

// ==================== CONTENT API ====================

const adminVisaContentAPI = {
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

const adminStoryContentAPI = {
  /**
   * Get all stories
   */
  getStories: (params?: PostParams) =>
    api.get<ApiResponse<PaginatedResponse<StoryResponse>>>("/stories/admin",
      {
        params
      }
    ),

  /**
   * Get story by ID
   */
  getStoryById: (storyId: string) =>
    api.get<ApiResponse<StoryResponse>>(`/stories/admin/${storyId}`),

  /**
   * Create a new story
   */
  createStory: (data: StoryRequest) =>
    api.post<ApiResponse<StoryResponse>>("/stories/admin", data),

  /**
   * Update a story
   */
  updateStory: (storyId: string, data: Partial<StoryRequest>) =>
    api.put<ApiResponse<StoryResponse>>(`/stories/admin/${storyId}`, data),

  /**
   * Delete a story
   */
  deleteStory: (storyId: string) =>
    api.delete<ApiResponse<void>>(`/stories/admin/${storyId}`),

  /**
   * Upload image for story
   */
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<ImageUploadResponse>>(
      "/stories/admin/upload/story-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  /**
   * Upload avatar for story
   */
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<ImageUploadResponse>>(
      "/stories/admin/upload/story-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};

export const adminCountryContentAPI = {
  getCountries: (params?: PostParams) =>
    api.get<ApiResponse<PaginatedResponse<CountryResponse>>>(
      "/countries/admin",
      {
        params,
      },
    ),

  getCountryById: (countryId: string) =>
    api.get<ApiResponse<CountryResponse>>(`/countries/admin/${countryId}`),

  createCountry: (data: CountryRequest) =>
    api.post<ApiResponse<CountryResponse>>("/countries/admin", data),

  updateCountry: (countryId: string, data: Partial<CountryRequest>) =>
    api.put<ApiResponse<CountryResponse>>(
      `/countries/admin/${countryId}`,
      data,
    ),

  deleteCountry: (countryId: string) =>
    api.delete<ApiResponse<void>>(`/countries/admin/${countryId}`),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<ImageUploadResponse>>(
      "/countries/admin/upload/country-image",
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
  visa: adminVisaContentAPI,
  country: adminCountryContentAPI,
  story: adminStoryContentAPI,
};

export default adminContentEndpoints;
