import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { CourseResponse } from "../company/companyCourseEndpoints";

export interface AdminCompanyCourseParams {
  page?: number;
  size?: number;
  status?: string;
}

export interface AdminCompanyCourseData {
  companyId: number;
  companyName: string;
  logoUrl: string;
  id: number;
  courseTitle: string;
  enrollType: "online" | "physical";
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
  location?: string;
  price?: string;
  enrolledStudents?: number;
  maxStudents?: number;
  views?: number;
  // applications?: number;
  createdAt: string;
}

export interface CompanyCourseCountsResponse {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const adminCompanyCourseAPI = {
  /**
   * Get company counts
   */
  getAdminCompanyCourseCounts: () =>
    api.get<ApiResponse<CompanyCourseCountsResponse>>(
      "/courses/admin/counts",
    ),

  getAdminCompaniesCourses: (params?: AdminCompanyCourseParams) =>
    api.get<ApiResponse<PaginatedResponse<AdminCompanyCourseData>>>(
      "/courses/admin",
      {
        params,
      },
    ),

  getAdminCompanyCourseById: (courseId: string) =>
    api.get<ApiResponse<CourseResponse>>(`/courses/company/${courseId}`),

  approveCompanyCourse: (courseId: string) =>
    api.post<ApiResponse<void>>(`/courses/${courseId}/approve`),

  rejectCompanyCourse: (courseId: string, reason: string) =>
    api.post<ApiResponse<void>>(`/courses/${courseId}/reject`, null, {
      params: { reason },
    }),
};
