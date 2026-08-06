// src/lib/redux/actions/authActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser, setLoading, setError, logout } from "../slices/authSlice";
import { clearUserData } from "../slices/userSlice";
import { authAPI } from "@/lib/api/endpoints/public/authEndpoints";
import { axiosClient } from "@/lib/api/axios";
import { LoginCredentials, User } from "../types";
import { AxiosError } from "axios";

// Helper to extract error message properly
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as {
      success?: boolean;
      message?: string;
      data?: Record<string, string>;
      errorCode?: string;
    };

    // Check if it's a validation error with data object
    if (responseData?.data && typeof responseData.data === "object") {
      // Extract first validation error message
      const firstErrorKey = Object.keys(responseData.data)[0];
      if (firstErrorKey) {
        return responseData.data[firstErrorKey];
      }
    }

    // Return the main message if available
    if (responseData?.message) {
      return responseData.message;
    }

    // Return default error messages based on status
    if (error.response?.status === 401) {
      return "Invalid credentials. Please try again.";
    }
    if (error.response?.status === 404) {
      return "User not found. Please check your credentials.";
    }
    if (error.response?.status === 429) {
      return "Too many attempts. Please try again later.";
    }
    if (error.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }
    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your connection.";
    }

    return error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { dispatch }) => {
    // dispatch(setLoading(true));

    try {
      const response = await authAPI.login(credentials);

      // response.data is ApiResponse<LoginData>
      const apiResponse = response.data;

      // Check if the response was successful
      if (apiResponse.success && apiResponse.data) {
        const { accessToken, refreshToken, user } = apiResponse.data;

        // Map the user data to your User interface
        const mappedUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role.toLowerCase() as
            | "seeker"
            | "company"
            | "admin"
            | "dev",
          avatar: user.avatar,
          status: user.status,
          isActive: user.isActive,
        };

        // console.log("User: ", mappedUser);

        axiosClient.setTokens(accessToken, refreshToken);
        dispatch(setUser(mappedUser));

        return user;
      } else {
        throw new Error(apiResponse.message || "Login failed");
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      // dispatch(setLoading(false));
    }
  },
);

// Fetch current user
export const fetchCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, { dispatch }) => {
    try {
      // Check if tokens exist
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No token found");
      }

      dispatch(setLoading(true));

      const response = await authAPI.getCurrentUser();
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const user = apiResponse.data;

        const mappedUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role.toLowerCase() as
            | "seeker"
            | "company"
            | "admin"
            | "dev",
          avatar: user.avatar,
          status: user.status,
          isActive: user.isActive,
        };

        dispatch(setUser(mappedUser));
        return mappedUser;
      } else {
        throw new Error(apiResponse.message || "Fetch user failed");
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      if (error instanceof AxiosError && error.response?.status === 401) {
        dispatch(logout());
        axiosClient.clearTokens();
      }

      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Logout user
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      axiosClient.clearTokens();
      dispatch(logout());
      dispatch(clearUserData());
    }
  },
);

// Refresh token
export const refreshTokenAction = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { dispatch }) => {
    try {
      const response = await authAPI.refreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      axiosClient.setTokens(accessToken, newRefreshToken || refreshToken);
      return accessToken;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      dispatch(logout());
      axiosClient.clearTokens();
      throw new Error(errorMessage);
    }
  },
);
