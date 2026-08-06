import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { CompanyCountsResponse, CompanyProfileData } from "../company/companyProfileEndpoints";

export interface AdminCompanyParams {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  industry?: string;
  activeJobs?: string;
  dateRange?: string;
  isVerified?: string;
}

export interface AdminCompanyProfileData {
  userId?: string;
  companyName?: string;
  logoUrl?: string;
  industry?: string;
  companyEmail?: string;
  hotlineNumber?: string;
  contactPersonName?: string;
  designation?: string;
  status?: string;
  jobCount?: number;
  courseCount?: number;
  activation?: boolean;
  createdAt: string;
}

export interface CompanyApprovedCountsResponse {
  all: number;
  active: number;
  suspended: number;
}

export const adminCompanyProfileAPI = {
  /**
   * Get company counts
   */
  getAdminCompanyCounts: () =>
    api.get<ApiResponse<CompanyCountsResponse>>(
      "/company/profiles/admin/counts",
    ),

  getAdminCompanyApprovedCounts: () =>
    api.get<ApiResponse<CompanyApprovedCountsResponse>>(
      "/company/profiles/admin/approved/counts",
    ),

  getAdminCompanies: (params?: AdminCompanyParams) =>
    api.get<ApiResponse<PaginatedResponse<AdminCompanyProfileData>>>(
      // "/company/profiles/admin/status",
      "/company/profiles/admin/search",
      {
        params,
      },
    ),

  getAdminCompanyById: (userId: string) =>
    api.get<ApiResponse<CompanyProfileData>>(
      `/company/profiles/admin/${userId}`,
    ),

  approveCompany: (userId: string) =>
    api.post<ApiResponse<void>>(`/company/profiles/admin/${userId}/approve`),

  rejectCompany: (userId: string) =>
    api.post<ApiResponse<void>>(`/company/profiles/admin/${userId}/reject`),

  activeCompany: (userId: string) =>
    api.post<ApiResponse<void>>(`/company/profiles/admin/${userId}/active`),

  suspendCompany: (userId: string) =>
    api.post<ApiResponse<void>>(`/company/profiles/admin/${userId}/suspend`),
};
