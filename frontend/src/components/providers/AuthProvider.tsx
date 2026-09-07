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
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialized = useRef(false);
  const userFetched = useRef(false);

  // Track if data has been fetched after login
  const savedJobsFetched = useRef(false);
  const savedCoursesFetched = useRef(false);
  const appliedJobsFetched = useRef(false);
  const appliedCoursesFetched = useRef(false);

  // Track previous auth state to detect login
  const prevIsAuthenticated = useRef(false);

  // Initial auth setup
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
          // Only fetch user if not already fetched and user data is not available
          if (!userFetched.current && !user) {
            userFetched.current = true;
            try {
              await dispatch(fetchCurrentUser()).unwrap();
            } catch (error) {
              console.error("Failed to fetch user:", error);
              userFetched.current = false;
            }
          } else if (user) {
            // User already exists in state, mark as fetched
            userFetched.current = true;
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [dispatch, user]);

  // Detect login and fetch data
  useEffect(() => {
    // When authentication becomes true and user data is available
    if (isAuthenticated && user && isInitialized) {
      // Check if this is a new login (state changed from false to true)
      if (!prevIsAuthenticated.current) {
        // Reset all fetch flags on new login
        savedJobsFetched.current = false;
        savedCoursesFetched.current = false;
        appliedJobsFetched.current = false;
        appliedCoursesFetched.current = false;
      }
      prevIsAuthenticated.current = true;

      // Fetch saved jobs
      if (!savedJobsFetched.current) {
        savedJobsFetched.current = true;
        dispatch(fetchSavedJobs({ page: 0, size: 100 }))
          .unwrap()
          .then(() => {
            console.log("Saved jobs fetched successfully");
          })
          .catch((error) => {
            console.error("Failed to fetch saved jobs:", error);
          });
      }

      // Fetch saved courses
      if (!savedCoursesFetched.current) {
        savedCoursesFetched.current = true;
        dispatch(fetchSavedCourses({ page: 0, size: 100 }))
          .unwrap()
          .then(() => {
            console.log("Saved courses fetched successfully");
          })
          .catch((error) => {
            console.error("Failed to fetch saved courses:", error);
          });
      }

      // Fetch applied job IDs
      if (!appliedJobsFetched.current) {
        appliedJobsFetched.current = true;
        dispatch(fetchAppliedJobIds({ page: 0, size: 100 }))
          .unwrap()
          .then(() => {
            console.log("Applied job IDs fetched successfully");
          })
          .catch((error) => {
            console.error("Failed to fetch applied job IDs:", error);
          });
      }

      // Fetch applied course IDs
      if (!appliedCoursesFetched.current) {
        appliedCoursesFetched.current = true;
        dispatch(fetchAppliedCourseIds({ page: 0, size: 100 }))
          .unwrap()
          .then(() => {
            console.log("Applied course IDs fetched successfully");
          })
          .catch((error) => {
            console.error("Failed to fetch applied course IDs:", error);
          });
      }
    } else if (!isAuthenticated) {
      // Reset flags when logged out
      prevIsAuthenticated.current = false;
      savedJobsFetched.current = false;
      savedCoursesFetched.current = false;
      appliedJobsFetched.current = false;
      appliedCoursesFetched.current = false;
    }
  }, [isAuthenticated, user, isInitialized, dispatch]);

  // Listen for auth logout events
  useEffect(() => {
    const handleAuthLogout = () => {
      setIsInitialized(false);
      hasInitialized.current = false;
      userFetched.current = false;
      savedJobsFetched.current = false;
      savedCoursesFetched.current = false;
      appliedJobsFetched.current = false;
      appliedCoursesFetched.current = false;
      prevIsAuthenticated.current = false;
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
