// src/lib/api/authEndpoints.ts
import { ApiResponse } from "@/types/apiResponse";
import { api } from "../../axios";

export interface RegisterRequest {
  role?: "seeker" | "company" | "admin";
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  companyName?: string;
  contactPerson?: string;
  designation?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// User data interface
export interface UserData {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  avatar?: string;
  status?: string;
  isActive?: boolean;
}

// Login data interface
export interface LoginData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserData;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "seeker" | "company" | "admin" | "dev";
  avatar?: string;
  status?: string;
  isActive?: boolean;
}

// Mock user data for development
// const MOCK_USER = {
//   id: 'dev-001',
//   name: 'Developer',
//   email: 'dev@godayana.lk',
//   phone: '+94771234567',
//   role: 'dev' as const,
//   avatar: '',
// };

// const MOCK_ACCESS_TOKEN = 'mock-access-token-' + Date.now();
// const MOCK_REFRESH_TOKEN = 'mock-refresh-token-' + Date.now();

export const authAPI = {
  register: (data: RegisterRequest, identifier: string, otp: string) => {
    return api.post(`/auth/register/verify?identifier=${identifier}&otpCode=${otp}`, data);
  },

  sendOtp: (data: RegisterRequest) => {
    return api.post("/auth/register/initiate", data);
  },

  login: (data: LoginRequest) => {
    return api.post<ApiResponse<LoginData>>("/auth/login", data)
    // return {
    //   data: {
    //     user: MOCK_USER,
    //     accessToken: MOCK_ACCESS_TOKEN,
    //     refreshToken: MOCK_REFRESH_TOKEN,
    //   },
    // };
  },

  refreshToken: (refreshToken: string) =>
    api.post<RefreshTokenResponse>("/auth/refresh", { refreshToken }),

  getCurrentUser: () => api.get<ApiResponse<User>>("/auth/me"),

  logout: () => api.post("/auth/logout"),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data: User) => api.put("/user/profile", data),
};
