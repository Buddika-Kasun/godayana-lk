// src/lib/redux/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "seeker" | "company" | "admin" | "dev";
  avatar?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData extends User {
  password: string;
  confirmPassword?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isRefreshing: boolean;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  salary: string;
  type: "full-time" | "part-time" | "contract" | "remote" | "internship";
  description: string;
  requirements: string[];
  postedDate: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
