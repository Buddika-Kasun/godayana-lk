import { ApiResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { JobResponse } from "../company/companyJobEndpoints";

// ==================== TYPES ====================

export interface PublicJobsParams {
  keyword?: string;
  location?: string;
  category?: string;
  type?: string;
  employmentType?: string;
  experience?: string;
  page?: number;
  size?: number;
}

export interface JobListResponse {
  id: string;
  companyId?: string;
  companyName?: string;
  logoUrl?: string;
  jobTitle?: string;
  category?: string;
  status?: string;
  type?: string;
  employmentType?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  views?: number;
  applications?: number;
  createdAt?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ==================== JOB API ====================

export const publicJobAPI = {
  /**
   * Get job by ID
   */
  getJobById: (jobId: string, params?: { isVisited?: boolean }) =>
    api.get<ApiResponse<JobResponse>>(`/jobs/public/${jobId}`, 
      {
        params,
      }
    ),

  getPublicJobs: (params?: PublicJobsParams) =>
    api.get<ApiResponse<PaginatedResponse<JobListResponse>>>(
      "/jobs/public/search",
      {
        params,
      },
    ),
};

// ==================== EXPORT ALL ====================

export const publicJobEndpoints = {
  ...publicJobAPI,
};

export default publicJobEndpoints;
