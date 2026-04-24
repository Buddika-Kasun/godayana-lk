// src/lib/redux/actions/authActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser, setLoading, setError, logout } from "../slices/authSlice";
import { clearUserData } from "../slices/userSlice";
import { authAPI } from "@/lib/api/endpoints";
import { axiosClient } from "@/lib/api/axios";
import { ApiError, LoginCredentials } from "../types";

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { dispatch }) => {
    try {
      dispatch(setLoading(true));

      const response = await authAPI.login(credentials);
      const { user, accessToken, refreshToken } = response.data;

      // Set tokens in axios client
      axiosClient.setTokens(accessToken, refreshToken);

      // Store user in Redux (not localStorage)
      dispatch(setUser(user));

      return user;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || "Login failed";
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Fetch current user (called when app loads or token exists)
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));

      const response = await authAPI.getCurrentUser();
      const user = response.data;

      dispatch(setUser(user));
      return user;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      // Token might be invalid, clear everything
      if (apiError.response?.status === 401) {
        dispatch(logout());
        axiosClient.clearTokens();
      }
      throw error;
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
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      axiosClient.clearTokens();
      dispatch(logout());
      dispatch(clearUserData());
    }
  },
);

// Refresh token (called by interceptor)
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string) => {
    const response = await authAPI.refreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    axiosClient.setTokens(accessToken, newRefreshToken || refreshToken);
    return accessToken;
  },
);
