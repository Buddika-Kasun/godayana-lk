import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { JobResponse } from "../company/companyJobEndpoints";

export interface AdminCompanyJobParams {
  page?: number;
  size?: number;
  status?: string;
}

export interface AdminCompanyJobData {
  companyId: number;
  companyName: string;
  logoUrl: string;
  id: number;
  jobTitle: string;
  jobType: "local" | "overseas";
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
  views?: number;
  location?: string;
  applications?: number;
  createdAt: string;
}

export interface CompanyJobCountsResponse {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const adminCompanyJobAPI = {
  /**
   * Get company counts
   */
  getAdminCompanyJobCounts: () =>
    api.get<ApiResponse<CompanyJobCountsResponse>>(
      "/jobs/admin/counts",
    ),

  getAdminCompaniesJobs: (params?: AdminCompanyJobParams) =>
    api.get<ApiResponse<PaginatedResponse<AdminCompanyJobData>>>(
      "/jobs/admin",
      {
        params,
      },
    ),

  getAdminCompanyJobById: (jobId: string) =>
    api.get<ApiResponse<JobResponse>>(`/jobs/company/${jobId}`),

  approveCompanyJob: (jobId: string) =>
    api.post<ApiResponse<void>>(`/jobs/${jobId}/approve`),

  rejectCompanyJob: (jobId: string, reason: string) =>
    api.post<ApiResponse<void>>(`/jobs/${jobId}/reject`, null, {
      params: { reason },
    }),
};
