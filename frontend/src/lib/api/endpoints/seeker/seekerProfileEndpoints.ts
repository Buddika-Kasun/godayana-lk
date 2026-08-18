// src/lib/api/seekerEndpoints.ts
import { ApiResponse } from "@/types/apiResponse";
import { api } from "../../axios";



export interface SeekerProfileData {
  id?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  profilePicUrl?: string;
  resumeUrl?: string;
  resumeFileKey?: string;
  skills?: string[]; // or string depending on your implementation
  experienceYears?: number;
  education?: string;
  studyField?: string;
  location?: string;
  dateOfBirth?: string; // or Date
  gender?: string;
  nationality?: string;
  employmentStatus?: string;
  currentJobTitle?: string;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: number; // in days/weeks
  portfolioUrl?: string;
  professionalSummary?: string;
  preferredJobCategories?: string[]; // or array of category objects
  shareCv?: boolean;
  isActive?: boolean;
  createdAt?: string; // or Date
  updatedAt?: string; // or Date
}


export const seekerProfileAPI = {
  getSeekerProfile: () =>
    api.get<ApiResponse<SeekerProfileData>>("/seeker/profiles/me"),
  updateSeekerProfile: (data: SeekerProfileData) =>
    api.put<ApiResponse<SeekerProfileData>>("/seeker/profiles/me", data),
  // uploadProfileImage: (data) => api.post<ApiResponse<SeekerProfileData>>("/seeker/profile/me/profile-pic", data),
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<ApiResponse<SeekerProfileData>>(
      "/seeker/profiles/me/profile-pic",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<ApiResponse<SeekerProfileData>>(
      "/seeker/profiles/me/resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  downloadResume: (fileKey: string) => {
    // Option 1: Download as blob (for programmatic download)
    return api.get<Blob>(
      `/files/download?fileKey=${encodeURIComponent(fileKey)}`,
      {
        responseType: "blob",
      },
    );
  },

};
