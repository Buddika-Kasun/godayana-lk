// src/lib/api/endpoints/public/publicCourseEndpoints.ts
import { ApiResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { CourseResponse } from "../company/companyCourseEndpoints";

// ==================== TYPES ====================

export interface PublicCourseParams {
  keyword?: string;
  category?: string;
  migrationPath?: string;
  requirementLevel?: string;
  page?: number;
  size?: number;
}

export interface CourseListResponse {
  id: string;
  companyId?: string;
  companyName?: string;
  logoUrl?: string;
  courseTitle: string;
  category: string;
  status?: string;
  enrollType: string;
  location?: string;
  price?: number;
  migrationPaths: string[];
  requirementLevel: string;
  duration: string;
  courseLevel: string;
  startDate: string;
  enrollmentCount?: number;
  viewCount?: number;
  // postedHoursAgo?: number;
  createdAt?: string;
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

// ==================== COURSE API ====================

export const publicCourseAPI = {
  /**
   * Get course by ID
   */
  getCourseById: (courseId: string, params?: { isVisited?: boolean }) =>
    api.get<ApiResponse<CourseResponse>>(`/courses/public/${courseId}`, {
      params,
    }),

  /**
   * Get public courses with filters
   */
  getPublicCourses: (params?: PublicCourseParams) =>
    api.get<ApiResponse<PaginatedResponse<CourseListResponse>>>(
      "/courses/public/search",
      {
        params,
      },
    ),
};

// ==================== EXPORT ====================

export const publicCourseEndpoints = {
  ...publicCourseAPI,
};

export default publicCourseEndpoints;
