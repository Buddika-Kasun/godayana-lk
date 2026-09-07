// src/components/providers/AuthProvider.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { fetchCurrentUser } from "@/lib/redux/actions/authActions";
import { axiosClient } from "@/lib/api/axios";
import { fetchSavedJobs } from "@/lib/redux/actions/savedJobsActions";
import { fetchSavedCourses } from "@/lib/redux/actions/savedCoursesActions";
import { fetchAppliedJobIds } from "@/lib/redux/actions/appliedJobsActions";
import { fetchAppliedCourseIds } from "@/lib/redux/actions/appliedCoursesActions";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialized = useRef(false);
  const savedJobsFetched = useRef(false);
  const savedCoursesFetched = useRef(false);
  const appliedJobsFetched = useRef(false);
  const appliedCoursesFetched = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      try {
        // Load tokens from localStorage
        axiosClient.loadTokensFromStorage();

        const accessToken = axiosClient.getAccessToken();

        if (accessToken) {
          // Token exists, fetch user from API
          try {
            await dispatch(fetchCurrentUser()).unwrap();
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [dispatch]);

  // Fetch saved jobs only when authenticated and initialized
  useEffect(() => {
    if (isAuthenticated && isInitialized && !savedJobsFetched.current) {
      savedJobsFetched.current = true;
      dispatch(fetchSavedJobs({ page: 0, size: 100 }))
        .unwrap()
        .then(() => {
          console.log("Saved jobs fetched successfully on refresh");
        })
        .catch((error) => {
          console.error("Failed to fetch saved jobs:", error);
          // Retry once if failed
          setTimeout(() => {
            dispatch(fetchSavedJobs({ page: 0, size: 100 })).catch(
              console.error,
            );
          }, 2000);
        });
    }
  }, [isAuthenticated, isInitialized, dispatch]);

  // Fetch saved courses only when authenticated and initialized
  useEffect(() => {
    if (isAuthenticated && isInitialized && !savedCoursesFetched.current) {
      savedCoursesFetched.current = true;
      dispatch(fetchSavedCourses({ page: 0, size: 100 }))
        .unwrap()
        .then(() => {
          console.log("Saved courses fetched successfully on refresh");
        })
        .catch((error) => {
          console.error("Failed to fetch saved courses:", error);
          // Retry once if failed
          setTimeout(() => {
            dispatch(fetchSavedCourses({ page: 0, size: 100 })).catch(
              console.error,
            );
          }, 2000);
        });
    }
  }, [isAuthenticated, isInitialized, dispatch]);

  // Fetch applied job IDs only when authenticated and initialized
  useEffect(() => {
    if (isAuthenticated && isInitialized && !appliedJobsFetched.current) {
      appliedJobsFetched.current = true;
      dispatch(fetchAppliedJobIds({ page: 0, size: 100 }))
        .unwrap()
        .then(() => {
          console.log("Applied job IDs fetched successfully on refresh");
        })
        .catch((error) => {
          console.error("Failed to fetch applied job IDs:", error);
          // Retry once if failed
          setTimeout(() => {
            dispatch(fetchAppliedJobIds({ page: 0, size: 100 })).catch(
              console.error,
            );
          }, 2000);
        });
    }
  }, [isAuthenticated, isInitialized, dispatch]);

  // Fetch applied course IDs only when authenticated and initialized
  useEffect(() => {
    if (isAuthenticated && isInitialized && !appliedCoursesFetched.current) {
      appliedCoursesFetched.current = true;
      dispatch(fetchAppliedCourseIds({ page: 0, size: 100 }))
        .unwrap()
        .then(() => {
          console.log("Applied course IDs fetched successfully on refresh");
        })
        .catch((error) => {
          console.error("Failed to fetch applied course IDs:", error);
          // Retry once if failed
          setTimeout(() => {
            dispatch(fetchAppliedCourseIds({ page: 0, size: 100 })).catch(
              console.error,
            );
          }, 2000);
        });
    }
  }, [isAuthenticated, isInitialized, dispatch]);

  // Listen for auth logout events
  useEffect(() => {
    const handleAuthLogout = () => {
      setIsInitialized(false);
      hasInitialized.current = false;
      savedJobsFetched.current = false;
      savedCoursesFetched.current = false;
      appliedJobsFetched.current = false;
      appliedCoursesFetched.current = false;
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
