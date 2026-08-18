// src/lib/api/endpoints/seeker/seekerVisaEndpoints.ts
import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";

// ==================== TYPES ====================

export interface VisaConsultationRequest {
  type: string;
  country: string;
  visaRejection: boolean;
  hasPassport: boolean;
  travelDate: string; // ISO date string
  note?: string;
}

export interface VisaConsultationResponse {
  id: string;
  seekerId: string;
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

export interface VisaGatewayCountResponse {
  visaCount: number;
  gatewayCount: number;
}

export interface VisaConsultationParams {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}


export interface GatewayConsultationRequest {
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
}

export interface GatewayConsultationResponse {
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

  id: string;
  seekerId: string;
  status: "PENDING" | "REVIEW" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

// ==================== VISA CONSULTATION API ====================

export const seekerVisaAPI = {
  /**
   * Create a new visa consultation
   * @param request - The visa consultation request data
   */
  createConsultation: (request: VisaConsultationRequest) =>
    api.post<ApiResponse<VisaConsultationResponse>>(
      "/visa-consultations",
      request,
    ),

  /**
   * Get all visa consultations for the current seeker
   * @param params - Pagination and filter parameters
   */
  getMyConsultations: (params?: VisaConsultationParams) =>
    api.get<ApiResponse<PaginatedResponse<VisaConsultationResponse>>>(
      "/visa-consultations/me",
      { params },
    ),

  // /**
  //  * Get a specific visa consultation by ID
  //  * @param consultationId - The ID of the consultation
  //  */
  // getConsultationById: (consultationId: string) =>
  //   api.get<ApiResponse<VisaConsultationResponse>>(
  //     `/visa-consultations/${consultationId}`,
  //   ),
   
  // /**
  //  * Update consultation status (for admin/company)
  //  * @param consultationId - The ID of the consultation
  //  * @param status - New status (PENDING, IN_REVIEW, APPROVED, REJECTED, COMPLETED)
  //  */
  // updateConsultationStatus: (consultationId: string, status: string) =>
  //   api.put<ApiResponse<VisaConsultationResponse>>(
  //     `/visa-consultations/${consultationId}/status`,
  //     null,
  //     { params: { status } },
  //   ),

  // /**
  //  * Update a visa consultation
  //  * @param consultationId - The ID of the consultation
  //  * @param request - The updated consultation data
  //  */
  // updateConsultation: (
  //   consultationId: string,
  //   request: VisaConsultationRequest,
  // ) =>
  //   api.put<ApiResponse<VisaConsultationResponse>>(
  //     `/visa-consultations/${consultationId}`,
  //     request,
  //   ),

  /**
   * Get count of visa consultations for the current seeker
   */
  countMyConsultations: () =>
    api.get<ApiResponse<VisaGatewayCountResponse>>("/visa-consultations/count"),
};

// ==================== GATEWAY CONSULTATION API ====================

export const seekerGatewayAPI = {
  /**
   * Create a new gateway consultation
   * @param request - The gateway consultation request data
   */
  createConsultation: (request: GatewayConsultationRequest) =>
    api.post<ApiResponse<GatewayConsultationResponse>>(
      "/gateway-consultations",
      request,
    ),

  /**
   * Get all gateway consultations for the current seeker
   * @param params - Pagination and filter parameters
   */
  getMyConsultations: (params?: VisaConsultationParams) =>
    api.get<ApiResponse<PaginatedResponse<GatewayConsultationResponse>>>(
      "/gateway-consultations/me",
      { params },
    ),

  /**
   * Get a specific gateway consultation by ID
   * @param consultationId - The ID of the consultation
   */
  getConsultationById: (consultationId: string) =>
    api.get<ApiResponse<GatewayConsultationResponse>>(
      `/gateway-consultations/${consultationId}`,
    ),

  // /**
  //  * Update consultation status (for admin/company)
  //  * @param consultationId - The ID of the consultation
  //  * @param status - New status (PENDING, IN_REVIEW, APPROVED, REJECTED, COMPLETED)
  //  */
  // updateConsultationStatus: (consultationId: string, status: string) =>
  //   api.put<ApiResponse<GatewayConsultationResponse>>(
  //     `/gateway-consultations/${consultationId}/status`,
  //     null,
  //     { params: { status } },
  //   ),

  // /**
  //  * Update a gateway consultation
  //  * @param consultationId - The ID of the consultation
  //  * @param request - The updated consultation data
  //  */
  // updateConsultation: (
  //   consultationId: string,
  //   request: GatewayConsultationRequest,
  // ) =>
  //   api.put<ApiResponse<GatewayConsultationResponse>>(
  //     `/gateway-consultations/${consultationId}`,
  //     request,
  //   ),

 };

// ==================== EXPORT ====================

export const seekerVisaGatewayEndpoints = {
  visa: seekerVisaAPI,
  gateway: seekerGatewayAPI
};

export default seekerVisaGatewayEndpoints;
