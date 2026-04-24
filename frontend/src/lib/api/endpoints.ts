// src/lib/api/endpoints.ts
import { api } from "./axios";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "seeker" | "company" | "admin" | "dev";
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
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
}

// Mock user data for development
const MOCK_USER = {
  id: 'dev-001',
  name: 'Developer',
  email: 'dev@godayana.lk',
  phone: '+94771234567',
  role: 'dev' as const,
  avatar: '',
};

const MOCK_ACCESS_TOKEN = 'mock-access-token-' + Date.now();
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-' + Date.now();

export const authAPI = {
  login: (data: LoginRequest) => {
    //api.post<LoginResponse>("/auth/login", data)
    return {
      data: {
        user: MOCK_USER,
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
      }
    }
  },

  refreshToken: (refreshToken: string) =>
    api.post<RefreshTokenResponse>("/auth/refresh", { refreshToken }),

  getCurrentUser: () => api.get<User>("/auth/me"),

  logout: () => api.post("/auth/logout"),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data: User) => api.put("/user/profile", data),
};
