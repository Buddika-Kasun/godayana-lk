// src/lib/api/endpoints/courseEndpoints.ts

import { ApiResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { CourseApplicationCountsResponse, CourseApplicationParams } from "../seeker/seekerCourseEndpoints";

// ==================== TYPES ====================

export interface CompanyDetails {
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

// Define the Lesson interface
export interface Lesson {
  title: string;
  duration: string;
  isPreview?: boolean;
}

// Define the Module interface
export interface Module {
  title: string;
  lessons: Lesson[];
}

// Define the Curriculum interface
export interface Curriculum {
  modules: Module[];
}

export interface CourseRequest {
  title: string;
  category?: string;
  categoryLabel?: string;
  description?: string;
  enrollType: "online" | "physical";
  location?: string;
  instructor: string;
  instructorBio?: string;
  instructorAvatar?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  schedule?: string;
  price?: number;
  maxStudents?: number;
  enrolledStudents?: number;
  rating?: number;
  curriculum?: Curriculum;
  benefits?: string[];
  requirements?: string[];
  lessons?: string[];
  learningOutcomes?: string[];
  includes?: string[];
  targetAudience?: string[];
  certificate?: boolean;
  certificateType?: string;
  contactEmail: string;
  contactPhone?: string;
  postedDate?: string;
  lastUpdated?: string;
  isEnrolled?: boolean;
  isSaved?: boolean;
  courseImageFileKey?: string;
  status?: "draft" | "pending" | "archived";
  // courseCategory?: string;
  migrationPaths?: string[];
  requirementLevel?: string;
}

export interface CourseResponse {
  id: string;
  companyId: string;
  companyName?: string;
  title: string;
  category?: string;
  categoryLabel?: string;
  description?: string;
  enrollType: "online" | "physical";
  location?: string;
  instructor: string;
  instructorBio?: string;
  instructorAvatar?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  schedule?: string;
  price?: number;
  maxStudents?: number;
  enrolledStudents?: number;
  rating?: number;
  curriculum?: Curriculum;
  benefits?: string[];
  requirements?: string[];
  lessons?: string[];
  learningOutcomes?: string[];
  includes?: string[];
  targetAudience?: string[];
  certificate?: boolean;
  certificateType?: string;
  contactEmail: string;
  contactPhone?: string;
  postedDate?: string;
  lastUpdated?: string;
  isEnrolled?: boolean;
  isSaved?: boolean;
  courseImageUrl?: string;
  courseImageFileKey?: string;
  confirmationEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "DRAFT";
  viewCount: number;
  enrollmentCount: number;
  postedHoursAgo: number;
  createdAt: string;
  updatedAt: string;
  company?: CompanyDetails;
  // courseCategory?: string;
  migrationPaths?: string[];
  requirementLevel?: string;
}

export interface CompanyCourseItem {
  id: string;
  status: string;
  title?: string;
  companyName?: string;
  enrollmentCount?: number;
  viewCount?: number;
  location?: string;
  createdAt: string;
  enrollType?: string;
  price?: number;
}

export interface CourseStats {
  totalApproved: number;
  totalPending: number;
  totalRejected: number;
  totalClosed: number;
  totalDraft: number;
}

export interface CourseListParams {
  search?: string;
  location?: string;
  type?: string;
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

export interface CourseCountsResponse {
  all: number;
  pending: number;
  approved: number;
  closed: number;
  draft: number;
  rejected: number;
}

export interface CourseImageUploadResponse {
  fileKey: string;
  fileUrl: string;
}

export interface CompanyCourseParams {
  page?: number;
  size?: number;
  status?: string;
}

export interface ReviewResponse {
  id: string;
  // userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewCreateRequest {
  courseId: string;
  rating: number;
  comment: string;
}

// ==================== COURSE API ====================

export const companyCourseAPI = {
  /**
   * Get course counts
   */
  getCourseCounts: () =>
    api.get<ApiResponse<CourseCountsResponse>>("/courses/company/counts"),

  /**
   * Create a new course
   */
  createCourse: (data: CourseRequest) =>
    api.post<ApiResponse<CourseResponse>>("/courses", data),

  /**
   * Update an existing course
   */
  updateCourse: (courseId: string, data: CourseRequest) =>
    api.put<ApiResponse<CourseResponse>>(`/courses/${courseId}`, data),

  /**
   * Get course by ID
   */
  getCourseById: (courseId: string) =>
    api.get<ApiResponse<CourseResponse>>(`/courses/${courseId}`),

  /**
   * Get all courses with filters
   */
  getAllCourses: (params?: CourseListParams) =>
    api.get<ApiResponse<PaginatedResponse<CourseResponse>>>("/courses", {
      params,
    }),

  /**
   * Get courses by company (for company dashboard)
   */
  getCompanyCourses: (params?: CompanyCourseParams) =>
    api.get<ApiResponse<PaginatedResponse<CompanyCourseItem>>>(
      "/courses/company",
      {
        params,
      },
    ),

  /**
   * Get course by ID for company
   */
  getCompanyCourseById: (courseId: string) =>
    api.get<ApiResponse<CourseResponse>>(`/courses/company/${courseId}`),

  /**
   * Get pending courses (admin only)
   */
  getPendingCourses: (page?: number, size?: number) =>
    api.get<ApiResponse<PaginatedResponse<CourseResponse>>>(
      "/courses/pending",
      {
        params: { page, size },
      },
    ),

  /**
   * Approve a course (admin only)
   */
  approveCourse: (courseId: string) =>
    api.post<ApiResponse<CourseResponse>>(`/courses/${courseId}/approve`),

  /**
   * Reject a course (admin only)
   */
  rejectCourse: (courseId: string, reason: string) =>
    api.post<ApiResponse<CourseResponse>>(`/courses/${courseId}/reject`, null, {
      params: { reason },
    }),

  /**
   * Close a course (company or admin)
   */
  closeCourse: (courseId: string) =>
    api.post<ApiResponse<CourseResponse>>(`/courses/${courseId}/close`),

  /**
   * Delete a course (company or admin)
   */
  deleteCourse: (courseId: string) =>
    api.delete<ApiResponse<void>>(`/courses/${courseId}`),

  /**
   * Search courses by keyword
   */
  searchCourses: (keyword: string, page?: number, size?: number) =>
    api.get<ApiResponse<PaginatedResponse<CourseResponse>>>("/courses/search", {
      params: { keyword, page, size },
    }),

  /**
   * Get course statistics (admin)
   */
  getCourseStats: () => api.get<ApiResponse<CourseStats>>("/courses/stats"),

  /**
   * Get company course statistics
   */
  getCompanyCourseStats: () =>
    api.get<
      ApiResponse<{
        totalApproved: number;
        totalPending: number;
        totalRejected: number;
        totalClosed: number;
        totalDraft: number;
      }>
    >("/courses/company/stats"),

  /**
   * Upload course image
   */
  uploadCourseImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<CourseImageUploadResponse>>(
      "/courses/upload/course-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );
  },
};

// ==================== COURSE ENROLLMENT API ====================

export interface CourseEnrollmentRequest {
  courseId: string;
}

export interface CourseEnrollmentResponse {
  id: string;
  courseId: string;
  courseTitle?: string;
  seekerId: string;
  seekerName?: string;
  seekerEmail?: string;
  status: "PENDING" | "ENROLLED" | "CANCELLED" | "REJECTED";
  enrolledAt: string;
  updatedAt: string;
}


export interface CompanyCourseApplicationResponse {
  seekerId: string;
  seekerName?: string;
  seekerProfileUrl?: string;
  seekerCvUrl?: string;
  seekerEmail?: string;
  seekerContactNo?: string;
  seekerExperience?: string;
  id: string;
  status?: string;
  appliedAt: string;
}

export const courseEnrollmentAPI = {
  /**
   * Enroll in a course
   */
  enrollInCourse: (data: CourseEnrollmentRequest) =>
    api.post<ApiResponse<CourseEnrollmentResponse>>("/enrollments", data),

  /**
   * Get count of applied courses for the current seeker
   */
  getCompanyCourseCount: (courseId: string) =>
    api.get<ApiResponse<CourseApplicationCountsResponse>>(
      `/enrollments/company/count/${courseId}`,
    ),

  /**
   * Get enrollments by course ID (company only)
   */
  getEnrollmentsByCourse: (courseId: string, params?: CourseApplicationParams) =>
      api.get<ApiResponse<PaginatedResponse<CompanyCourseApplicationResponse>>>(
        `/enrollments/course/${courseId}`,
        { params },
      ),

  /**
   * Get my enrollments (seeker)
   */
  getMyEnrollments: (page?: number, size?: number) =>
    api.get<ApiResponse<PaginatedResponse<CourseEnrollmentResponse>>>(
      "/enrollments/me",
      {
        params: { page, size },
      },
    ),

  /**
   * Get enrollment by ID
   */
  getEnrollmentById: (enrollmentId: string) =>
    api.get<ApiResponse<CourseEnrollmentResponse>>(
      `/enrollments/${enrollmentId}`,
    ),

  /**
   * Update enrollment status (company only)
   */
  updateEnrollmentStatus: (enrollmentId: string, status: string) =>
    api.put<ApiResponse<CourseEnrollmentResponse>>(
      `/enrollments/${enrollmentId}/status`,
      null,
      {
        params: { status },
      },
    ),

  /**
   * Cancel enrollment (seeker only)
   */
  cancelEnrollment: (enrollmentId: string) =>
    api.delete<ApiResponse<void>>(`/enrollments/${enrollmentId}`),

  /**
   * Check if user has enrolled in a course
   */
  hasEnrolled: (courseId: string) =>
    api.get<ApiResponse<boolean>>("/enrollments/check", {
      params: { courseId },
    }),
};

// ==================== REVIEW API ====================

export const reviewAPI = {
  /**
   * Create a review
   */
  createReview: (data: ReviewCreateRequest) =>
    api.post<ApiResponse<ReviewResponse>>("/reviews", data),

  /**
   * Get reviews for a course
   */
  getReviewsByCourse: (courseId: string, page?: number, size?: number) =>
    api.get<ApiResponse<PaginatedResponse<ReviewResponse>>>(
      `/reviews/course/${courseId}`,
      {
        params: { page, size },
      },
    ),
};

// ==================== EXPORT ALL ====================

export const companyCourseEndpoints = {
  ...companyCourseAPI,
  enrollments: courseEnrollmentAPI,
  reviews: reviewAPI,
};

export default companyCourseEndpoints;
