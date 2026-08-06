// src/lib/api/endpoints/admin/adminVisaEndpoints.ts
import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { VisaConsultationParams, VisaConsultationResponse, VisaGatewayCountResponse } from "../seeker/seekerVisaGatewayEndpoints";

// ==================== TYPES ====================

export interface CountryCountResponse {
  country: string;
  count: number;
}

export interface VisaConsultationCountryParams {
  country: string;
  type?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface VisaConsultationCountryResponse {
  id: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  seekerPhone: string;
  seekerProfileImage: string;
  type: "STUDENT" | "WORK" | "VISIT";
  country: string;
  visaRejection: boolean;
  hasPassport: boolean;
  travelDate: string;
  note?: string;
  status: "PENDING" | "REVIEW" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export interface VisaCountryCountRequest {
  country: string;
  type?: string;
}

export interface VisaCountryCountResponse {
  student: number;
  work: number;
  visit: number;
  pending: number;
  inReview: number;
  completed: number;
  cancelled: number;
}

export interface GatewayConsultationResponse {
  id: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  seekerPhone: string;
  seekerProfileImage: string;

  // Study Preferences
  country: string;
  otherCountry: string;
  studyField: string;
  otherStudyField: string;
  studyLevel: string;
  intake: string;
  universityType?: string;
  languageTestStatus: string;

  // Financial Planning
  budget: number | undefined;
  familySponsorship: string;
  educationLoan: string;

  // Readiness
  hasPassport: string;
  visaRejection: string;
  applyWithin: string;

  status: "PENDING" | "REVIEW" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

// ==================== VISA CONSULTATION API ====================

export const adminVisaAPI = {
  /**
   * Get all visa consultations for the admin
   * @param params - Pagination and filter parameters
   */
  getAdminConsultations: (params?: VisaConsultationParams) =>
    api.get<ApiResponse<PaginatedResponse<CountryCountResponse>>>(
      "/visa-consultations/admin",
      { params },
    ),

  /**
   * Get a specific visa consultation by country for the admin
   * @param params - Filter parameters including country
   */
  getConsultationByCountry: (params?: VisaConsultationCountryParams) =>
    api.get <
    ApiResponse<PaginatedResponse<VisaConsultationCountryResponse>>>(
      `/visa-consultations/admin/country`,
      { params },
    ),

  /**
   * Update consultation status (for admin/company)
   * @param consultationId - The ID of the consultation
   * @param status - New status (PENDING, IN_REVIEW, APPROVED, REJECTED, COMPLETED)
   */
  updateConsultationStatus: (consultationId: string, status: string) =>
    api.put<ApiResponse<VisaConsultationResponse>>(
      `/visa-consultations/${consultationId}/status`,
      null,
      { params: { status } },
    ),

  /**
   * Get count of visa consultations for the admin
   */
  countAdminConsultations: () =>
    api.get<ApiResponse<VisaGatewayCountResponse>>(
      "/visa-consultations/admin/count",
    ),

  countAdminConsultationsByCountry: (params?: VisaCountryCountRequest) =>
    api.get<ApiResponse<VisaCountryCountResponse>>(
      `/visa-consultations/admin/count-country`,
      { params },
    ),
};

// ==================== VISA CONSULTATION API ====================

export const adminGatewayAPI = {
  /**
   * Get all gateway consultations for the admin
   * @param params - Pagination and filter parameters
   */
  getAdminConsultations: (params?: VisaConsultationParams) =>
    api.get<ApiResponse<PaginatedResponse<CountryCountResponse>>>(
      "/gateway-consultations/admin",
      { params },
    ),

  /**
   * Get a specific gateway consultation by country for the admin
   * @param params - Filter parameters including country
   */
  getConsultationByCountry: (params?: VisaConsultationCountryParams) =>
    api.get<ApiResponse<PaginatedResponse<GatewayConsultationResponse>>>(
      `/gateway-consultations/admin/country`,
      { params },
    ),

  /**
   * Update consultation status (for admin/company)
   * @param consultationId - The ID of the consultation
   * @param status - New status (PENDING, IN_REVIEW, APPROVED, REJECTED, COMPLETED)
   */
  updateConsultationStatus: (consultationId: string, status: string) =>
    api.put<ApiResponse<GatewayConsultationResponse>>(
      `/gateway-consultations/${consultationId}/status`,
      null,
      { params: { status } },
    ),

  /**
   * Get count of gateway consultations for the admin
   */
  countAdminConsultations: () =>
    api.get<ApiResponse<VisaGatewayCountResponse>>(
      "/gateway-consultations/admin/count",
    ),

  countAdminConsultationsByCountry: (params?: VisaCountryCountRequest) =>
    api.get<ApiResponse<VisaCountryCountResponse>>(
      `/gateway-consultations/admin/count-country`,
      { params },
    ),
};

// ==================== EXPORT ====================

export const adminVisaGatewayEndpoints = {
  visa: adminVisaAPI,
  gateway: adminGatewayAPI
};

export default adminVisaGatewayEndpoints;
