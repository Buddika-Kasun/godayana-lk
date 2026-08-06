// src/lib/api/endpoints/seeker/seekerJobEndpoints.ts
import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";

// ==================== TYPES ====================

export interface SavedJobResponse {
  jobId: string;
  seekerId: string;
  savedAt: string;
}

export interface SavedJobsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface JobApplicationResponse {
  id: string;
  jobId: string;
  jobTitle?: string;
  location?: string;
  companyName?: string;
  logoUrl?: string;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  // isSaved?: boolean;
  appliedAt: string;
  savedAt: string;
}

export interface JobApplicationParams {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface JobApplicationCountsResponse {
  jobTitle?: string;
  all: number;
  pending?: number;
  active?: number;
  shortlisted?: number;
  hired?: number;
  rejected?: number;
}

// ==================== SAVED JOB API ====================

const seekerSavedJobAPI = {
  /**
   * Save a job
   * @param jobId - The ID of the job to save
   */
  saveJob: (jobId: string) =>
    api.post<ApiResponse<SavedJobResponse>>(`/jobs/save/${jobId}`),

  /**
   * Get all saved jobs for the current seeker
   */
  getSavedJobs: (params?: SavedJobsParams) =>
    api.get<ApiResponse<PaginatedResponse<SavedJobResponse>>>("/jobs/save", {
      params,
    }),

  /**
   * Get count of saved jobs for the current seeker
   */
  getSavedJobsCount: () =>
    api.get<ApiResponse<number>>("/jobs/save/count"),

  /**
   * Remove a specific saved job
   * @param jobId - The ID of the saved job to remove
   */
  removeSavedJob: (jobId: string) =>
    api.delete<ApiResponse<void>>(`/jobs/save/${jobId}`),

  /**
   * Remove all saved jobs for the current seeker
   */
  removeAllSavedJobs: () => api.delete<ApiResponse<void>>("/jobs/save"),

  /**
   * Check if a job is saved by the current seeker
   * @param jobId - The ID of the job to check
   */
  isJobSaved: (jobId: string) =>
    api.get<ApiResponse<boolean>>(`/jobs/save/check/${jobId}`),
};

// ==================== JOB APPLICATION API ====================

const seekerJobApplicationAPI = {
  /**
   * Apply for a job
   * @param jobId - The ID of the job to apply for
   * @param coverLetter - Optional cover letter
   */
  applyForJob: (jobId: string, coverLetter?: string) =>
    api.post<ApiResponse<JobApplicationResponse>>(`/applications`, {
      jobId: jobId,
      coverLetter: coverLetter,
    }),

  /**
   * Get count of applied jobs for the current seeker
   */
  getAppliedJobsCount: () =>
    api.get<ApiResponse<JobApplicationCountsResponse>>("/applications/count"),

  /**
   * Get count of applied jobs for the current seeker
   */
  getCompanyJobsCount: (jobId: string) =>
    api.get<ApiResponse<JobApplicationCountsResponse>>(
      `/applications/company/count/${jobId}`,
    ),

  /**
   * Get all applications for the current seeker
   */
  getMyApplications: (params?: JobApplicationParams) =>
    api.get<ApiResponse<PaginatedResponse<JobApplicationResponse>>>(
      "/applications/me",
      { params },
    ),

  /**
   * Get all applied job IDs for the current seeker
   */
  getMyApplicationJobIds: (params?: JobApplicationParams) =>
    api.get<ApiResponse<PaginatedResponse<string>>>("/applications/me/ids", {
      params,
    }),

  /**
   * Get a specific application by ID
   * @param applicationId - The ID of the application
   */
  getApplicationById: (applicationId: string) =>
    api.get<ApiResponse<JobApplicationResponse>>(
      `/applications/${applicationId}`,
    ),

  /**
   * Update application status (company only)
   * @param applicationId - The ID of the application
   * @param status - New status (PENDING, REVIEWED, SHORTLISTED, REJECTED, HIRED)
   */
  updateApplicationStatus: (applicationId: string, status: string) =>
    api.put<ApiResponse<JobApplicationResponse>>(
      `/applications/${applicationId}/status`,
      null,
      { params: { status } },
    ),

  /**
   * Withdraw an application (seeker only)
   * @param applicationId - The ID of the application to withdraw
   */
  withdrawApplication: (applicationId: string) =>
    api.delete<ApiResponse<void>>(`/applications/${applicationId}`),

  /**
   * Check if the current seeker has applied for a specific job
   * @param jobId - The ID of the job to check
   */
  hasApplied: (jobId: string) =>
    api.get<ApiResponse<boolean>>("/applications/check", {
      params: { jobId },
    }),
};

export const seekerJobAPI = {
  save: seekerSavedJobAPI,
  application: seekerJobApplicationAPI
}
