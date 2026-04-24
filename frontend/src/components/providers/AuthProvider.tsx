// src/components/providers/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { fetchCurrentUser } from "@/lib/redux/actions/authActions";
import { axiosClient } from "@/lib/api/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Load tokens from localStorage (only tokens, no user data)
      axiosClient.loadTokensFromStorage();

      const accessToken = axiosClient.getAccessToken();

      if (accessToken) {
        // Token exists, fetch user from API
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error("Failed to fetch user:", error);
          // Token might be expired, interceptor will handle refresh
        }
      }

      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch]);

  // Listen for auth logout events
  useEffect(() => {
    const handleAuthLogout = () => {
      setIsInitialized(false);
      window.location.href = "/auth/login";
    };

    window.addEventListener("authLogout", handleAuthLogout);
    return () => window.removeEventListener("authLogout", handleAuthLogout);
  }, []);

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}