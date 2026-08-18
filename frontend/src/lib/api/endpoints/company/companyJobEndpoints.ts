import { ApiResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { JobApplicationCountsResponse, JobApplicationParams } from "../seeker/seekerJobEndpoints";

// ==================== TYPES ====================

export interface MatchingCriteria {
  skills: boolean;
  experience: boolean;
  education: boolean;
  location: boolean;
}

export interface companyDetails {
  id: string;
  userId: string;
  companyName: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  companyType?: string;
  employeeCount?: number;
  location?: string;
}

export interface JobRequest {
  jobTitle: string;
  category?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryNegotiable?: boolean;
  educationLevel?: string;
  minExperience?: string;
  employmentType: string;
  fieldOfStudy?: string;
  minAge?: number;
  maxAge?: number;
  jobDescription: string;
  startTime?: string;
  endTime?: string;
  // workingHours?: string;
  benefits?: string;
  applicationDeadline?: string;
  confirmationEmail: string;
  type: "local" | "overseas";
  skills: string[];
  descriptionImageFileKey?: string;
  cvDeliveryOption: "direct" | "matched";
  matchingCriteria?: MatchingCriteria;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "DRAFT";
}

export interface JobResponse {
  id: string;
  companyId: string;
  companyName?: string;
  jobTitle: string;
  category?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryNegotiable?: boolean;
  educationLevel?: string;
  minExperience?: string;
  employmentType?: string;
  fieldOfStudy?: string;
  minAge?: number;
  maxAge?: number;
  jobDescription: string;
  startTime?: string;
  endTime?: string;
  // workingHours?: string;
  benefits?: string;
  applicationDeadline?: string;
  confirmationEmail: string;
  type: "local" | "overseas";
  skills: string[];
  descriptionImageUrl?: string;
  descriptionImageFileKey?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "DRAFT";
  viewCount: number;
  applicationCount: number;
  postedHoursAgo: number;
  createdAt: string;
  updatedAt: string;
  cvDeliveryOption: "direct" | "matched";
  matchingCriteria?: MatchingCriteria;

  company?: companyDetails;
}

export interface CompanyJobItem {
  id: string;
  status: string;
  jobTitle?: string;
  companyName?: string;
  applicationCount?: number;
  viewCount?: number;
  location?: string;
  createdAt: string;
  type?: string;
}

export interface JobApplicationRequest {
  jobId: string;
  coverLetter?: string;
}

export interface JobApplicationResponse {
  id: string;
  jobId: string;
  jobTitle?: string;
  seekerId: string;
  seekerName?: string;
  seekerEmail?: string;
  coverLetter?: string;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  appliedAt: string;
  updatedAt: string;
}

export interface JobStats {
  totalApproved: number;
  totalPending: number;
  totalRejected: number;
  totalClosed: number;
  totalDraft: number;
}

export interface JobListParams {
  search?: string;
  location?: string;
  type?: string;
  employmentType?: string;
  category?: string;
  status?: string;
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

export interface JobCountsResponse {
  all: number;
  pending: number;
  approved: number;
  closed: number;
  draft: number;
  rejected: number;
}

export interface JobImageUploadResponse {
  fileKey: string;
  fileUrl: string;
}

export interface CompanyJobParams {
    page?: number;
    size?: number;
    status?: string;
}


export interface CompanyJobApplicationResponse {
  seekerId: string;
  seekerName?: string;
  seekerProfileUrl?: string;
  seekerCvUrl?: string;
  seekerEmail?: string;
  seekerContactNo?: string;
  seekerExperience?: string;
  id: string;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  appliedAt: string;
}

// ==================== JOB API ====================

export const companyJobAPI = {
  getJobCounts: () =>
    api.get<ApiResponse<JobCountsResponse>>("/jobs/company/counts"),

  /**
   * Create a new job
   */
  createJob: (data: JobRequest) =>
    api.post<ApiResponse<JobResponse>>("/jobs", data),

  /**
   * Update an existing job
   */
  updateJob: (jobId: string, data: JobRequest) =>
    api.put<ApiResponse<JobResponse>>(`/jobs/${jobId}`, data),

  /**
   * Get job by ID
   */
  getJobById: (jobId: string) =>
    api.get<ApiResponse<JobResponse>>(`/jobs/${jobId}`),

  /**
   * Get all jobs with filters
   */
  getAllJobs: (params?: JobListParams) =>
    api.get<ApiResponse<PaginatedResponse<JobResponse>>>("/jobs", { params }),

  /**
   * Get jobs by company (for company dashboard)
   */
  getCompanyJobs: (params?: CompanyJobParams) =>
    api.get<ApiResponse<PaginatedResponse<CompanyJobItem>>>("/jobs/company", {
      params,
    }),

  /**
   * Get job by ID
   */
  getCompanyJobById: (jobId: string) =>
    api.get<ApiResponse<JobResponse>>(`/jobs/company/${jobId}`),

  /**
   * Get pending jobs (admin only)
   */
  getPendingJobs: (page?: number, size?: number) =>
    api.get<ApiResponse<PaginatedResponse<JobResponse>>>("/jobs/pending", {
      params: { page, size },
    }),

  /**
   * Close a job (company or admin)
   */
  closeJob: (jobId: string) =>
    api.post<ApiResponse<JobResponse>>(`/jobs/${jobId}/close`),

  /**
   * Delete a job (company or admin)
   */
  deleteJob: (jobId: string) => api.delete<ApiResponse<void>>(`/jobs/${jobId}`),

  /**
   * Search jobs by keyword
   */
  searchJobs: (keyword: string, page?: number, size?: number) =>
    api.get<ApiResponse<PaginatedResponse<JobResponse>>>("/jobs/search", {
      params: { keyword, page, size },
    }),

  /**
   * Get job statistics (admin)
   */
  getJobStats: () => api.get<ApiResponse<JobStats>>("/jobs/stats"),

  /**
   * Get company job statistics
   */
  getCompanyJobStats: () =>
    api.get<
      ApiResponse<{
        totalApproved: number;
        totalPending: number;
        totalRejected: number;
        totalClosed: number;
        totalDraft: number;
      }>
    >("/jobs/company/stats"),

  /**
   * Upload job description image
   */
  uploadJobImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<JobImageUploadResponse>>(
      "/jobs/upload/job-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // ← 60 seconds timeout
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );
  },
  
};

// ==================== JOB APPLICATION API ====================

export const companyJobApplicationAPI = {
  /**
   * Apply for a job
   */
  applyForJob: (data: JobApplicationRequest) =>
    api.post<ApiResponse<JobApplicationResponse>>("/applications", data),

  /**
     * Get count of applied jobs for the current seeker
     */
    getCompanyJobsCount: (jobId: string) =>
      api.get<ApiResponse<JobApplicationCountsResponse>>(
        `/applications/company/count/${jobId}`,
      ),

  /**
   * Get applications by job ID (company only)
   */
  getApplicationsByJob: (jobId: string, params?: JobApplicationParams) =>
      api.get<ApiResponse<PaginatedResponse<CompanyJobApplicationResponse>>>(
        `/applications/job/${jobId}`,
        { params },
      ),

  /**
   * Get my applications (seeker)
   */
  getMyApplications: (page?: number, size?: number) =>
    api.get<ApiResponse<PaginatedResponse<JobApplicationResponse>>>(
      "/applications/me",
      {
        params: { page, size },
      },
    ),

  /**
   * Get application by ID
   */
  getApplicationById: (applicationId: string) =>
    api.get<ApiResponse<JobApplicationResponse>>(
      `/applications/${applicationId}`,
    ),

  /**
   * Update application status (company only)
   */
  updateApplicationStatus: (applicationId: string, status: string) =>
    api.put<ApiResponse<JobApplicationResponse>>(
      `/applications/${applicationId}/status`,
      null,
      {
        params: { status },
      },
    ),

  /**
   * Withdraw application (seeker only)
   */
  withdrawApplication: (applicationId: string) =>
    api.delete<ApiResponse<void>>(`/applications/${applicationId}`),

  /**
   * Check if user has applied for a job
   */
  hasApplied: (jobId: string) =>
    api.get<ApiResponse<boolean>>("/applications/check", {
      params: { jobId },
    }),
};

// ==================== EXPORT ALL ====================

export const companyJobEndpoints = {
  ...companyJobAPI,
  applications: companyJobApplicationAPI,
};

export default companyJobEndpoints;
