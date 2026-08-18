// src/lib/api/endpoints/seeker/seekerJobEndpoints.ts
import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";

// ==================== TYPES ====================

export interface SavedCourseResponse {
  courseId: string;
  seekerId: string;
  savedAt: string;
}

export interface SavedCourseParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface CourseApplicationResponse {
  id: string;
  courseId: string;
  courseTitle?: string;
  location?: string;
  companyName?: string;
  logoUrl?: string;
  status?: string;
  // isSaved?: boolean;
  appliedAt: string;
  savedAt: string;
}

export interface CourseApplicationParams {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CourseApplicationCountsResponse {
  courseTitle?: string;
  all: number;
  pending?: number;
  enrolled?: number;
  rejected?: number;
}

// ==================== SAVED COURSE API ====================

const seekerSavedCourseAPI = {
  /**
   * Save a course
   * @param courseId - The ID of the course to save
   */
  saveCourse: (courseId: string) =>
    api.post<ApiResponse<SavedCourseResponse>>(`/courses/save/${courseId}`),

  /**
   * Get all saved courses for the current seeker
   */
  getSavedCourses: (params?: SavedCourseParams) =>
    api.get<ApiResponse<PaginatedResponse<SavedCourseResponse>>>("/courses/save", {
      params,
    }),

  /**
   * Get count of saved courses for the current seeker
   */
  getSavedCoursesCount: () =>
    api.get<ApiResponse<number>>("/courses/save/count"),

  /**
   * Remove a specific saved course
   * @param courseId - The ID of the saved course to remove
   */
  removeSavedCourse: (courseId: string) =>
    api.delete<ApiResponse<void>>(`/courses/save/${courseId}`),

  /**
   * Remove all saved courses for the current seeker
   */
  removeAllSavedCourses: () => api.delete<ApiResponse<void>>("/courses/save"),

  /**
   * Check if a course is saved by the current seeker
   * @param courseId - The ID of the course to check
   */
  isCourseSaved: (courseId: string) =>
    api.get<ApiResponse<boolean>>(`/courses/save/check/${courseId}`),
};

// ==================== COURSE APPLICATION API ====================

const seekerCourseApplicationAPI = {
  /**
   * Apply for a course
   * @param courseId - The ID of the course to apply for
   */
  applyForCourse: (courseId: string) =>
    api.post<ApiResponse<CourseApplicationResponse>>(`/enrollments/${courseId}`),

  /**
   * Get count of applied course for the current seeker
   */
  getAppliedCoursesCount: () =>
    api.get<ApiResponse<CourseApplicationCountsResponse>>("/enrollments/count"),

  /**
   * Get all applications for the current seeker
   */
  getMyApplications: (params?: CourseApplicationParams) =>
    api.get<ApiResponse<PaginatedResponse<CourseApplicationResponse>>>(
      "/enrollments/me",
      { params },
    ),

  /**
   * Get all applied course IDs for the current seeker
   */
  getMyApplicationCourseIds: (params?: CourseApplicationParams) =>
    api.get<ApiResponse<PaginatedResponse<string>>>("/enrollments/me/ids", {
      params,
    }),

  /**
   * Get a specific application by ID
   * @param applicationId - The ID of the application
   */
  getApplicationById: (applicationId: string) =>
    api.get<ApiResponse<CourseApplicationResponse>>(
      `/enrollments/${applicationId}`,
    ),

  /**
   * Update application status (company only)
   * @param applicationId - The ID of the application
   * @param status - New status (PENDING, REVIEWED, SHORTLISTED, REJECTED, HIRED)
   */
  updateApplicationStatus: (applicationId: string, status: string) =>
    api.put<ApiResponse<CourseApplicationResponse>>(
      `/enrollments/${applicationId}/status`,
      null,
      { params: { status } },
    ),

  /**
   * Withdraw an application (seeker only)
   * @param applicationId - The ID of the application to withdraw
   */
  withdrawApplication: (applicationId: string) =>
    api.delete<ApiResponse<void>>(`/enrollments/${applicationId}`),

  /**
   * Check if the current seeker has applied for a specific job
   * @param jobId - The ID of the job to check
   */
  hasApplied: (jobId: string) =>
    api.get<ApiResponse<boolean>>("/enrollments/check", {
      params: { jobId },
    }),
};

export const seekerCourseAPI = {
  save: seekerSavedCourseAPI,
  application: seekerCourseApplicationAPI
}
