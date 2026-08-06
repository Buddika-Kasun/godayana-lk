import { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { SeekerProfileData } from "../seeker/seekerProfileEndpoints";

export interface AdminSeekerParams {
  page?: number;
  size?: number;
  status?: string;
  isActive?: string;
  search?: string;
  location?: string;
  gender?: string;
  educationLevel?: string;
  experience?: string;
  dateRange?: string;
}

export interface AdminSeekerProfileData {
  userId: string;
  name?: string;
  profileImageUrl?: string;
  contactNo: string;
  status?: string;
  activation?: boolean;
  appliedCount?: number;
  enrolledCount?: number;
  createdAt: string;
}

export interface SeekerApprovedCountsResponse {
  all: number;
  active: number;
  suspended: number;
}

export const adminSeekerProfileAPI = {
  getAdminSeekerApprovedCounts: () =>
    api.get<ApiResponse<SeekerApprovedCountsResponse>>(
      "/seeker/profiles/admin/approved/counts",
    ),

  getAdminSeekers: (params?: AdminSeekerParams) =>
    api.get<ApiResponse<PaginatedResponse<AdminSeekerProfileData>>>(
      // "/seeker/profiles/admin/status",
      "/seeker/profiles/admin/search",
      {
        params,
      },
    ),

  getAdminSeekerById: (userId: string) =>
    api.get<ApiResponse<SeekerProfileData>>(`/seeker/profiles/admin/${userId}`),

  activeSeeker: (userId: string) =>
    api.post<ApiResponse<void>>(`/seeker/profiles/admin/${userId}/active`),

  suspendSeeker: (userId: string) =>
    api.post<ApiResponse<void>>(`/seeker/profiles/admin/${userId}/suspend`),
};
