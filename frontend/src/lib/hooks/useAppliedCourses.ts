// src/lib/hooks/useAppliedCourses.ts
"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  fetchAppliedCourseIds,
  checkCourseApplied,
  applyForCourse,
  withdrawCourseApplication,
  clearAppliedCourses,
} from "../redux/actions/appliedCoursesActions";
import {
  selectAppliedCourseIds,
  selectIsLoadingAppliedCourses,
  selectIsApplying,
} from "../redux/slices/appliedCoursesSlice";
import { useAuth } from "./useAuth";

interface UseAppliedCoursesOptions {
  courseId?: string;
  autoFetch?: boolean;
}

export function useAppliedCourses({
  courseId,
  autoFetch = false,
}: UseAppliedCoursesOptions = {}) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const appliedCourseIds = useAppSelector(selectAppliedCourseIds);
  const isLoading = useAppSelector(selectIsLoadingAppliedCourses);
  const isApplying = useAppSelector(selectIsApplying);

  // Check if a specific course is applied
  const checkIfApplied = useCallback(
    async (id: string) => {
      if (!id || !isAuthenticated) return false;
      try {
        const result = await dispatch(checkCourseApplied(id)).unwrap();
        return result.hasApplied;
      } catch (error) {
        console.error("Error checking applied status:", error);
        return false;
      }
    },
    [dispatch, isAuthenticated],
  );

  // Fetch all applied course IDs
  const fetchAppliedCourses = useCallback(
    async (page = 0, size = 100) => {
      if (!isAuthenticated) return [];
      try {
        const result = await dispatch(
          fetchAppliedCourseIds({ page, size }),
        ).unwrap();
        return result;
      } catch (error) {
        console.error("Error fetching applied courses:", error);
        return [];
      }
    },
    [dispatch, isAuthenticated],
  );

  // Apply for a course
  const applyCourse = useCallback(
    async (id: string) => {
      if (!id || !isAuthenticated) return false;
      try {
        await dispatch(applyForCourse({ courseId: id })).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch, isAuthenticated],
  );

  // Withdraw an application
  const withdrawCourseApplicationHandler = useCallback(
    async (applicationId: string) => {
      if (!applicationId || !isAuthenticated) return false;
      try {
        await dispatch(withdrawCourseApplication(applicationId)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch, isAuthenticated],
  );

  // Clear applied courses from state
  const clearAppliedCoursesState = useCallback(() => {
    dispatch(clearAppliedCourses());
  }, [dispatch]);

  // Check if a course is applied (synchronous)
  const isCourseApplied = useCallback(
    (id: string) => {
      return appliedCourseIds.includes(id);
    },
    [appliedCourseIds],
  );

  // Auto-fetch when courseId is provided
  useEffect(() => {
    if (courseId && autoFetch && isAuthenticated) {
      checkIfApplied(courseId);
    }
  }, [courseId, autoFetch, isAuthenticated, checkIfApplied]);

  return {
    // State
    isApplied: courseId ? appliedCourseIds.includes(courseId) : false,
    appliedCourseIds,
    isLoading,
    isApplying,

    // Actions
    checkIfApplied,
    fetchAppliedCourses,
    applyCourse,
    withdrawCourseApplication: withdrawCourseApplicationHandler,
    clearAppliedCoursesState,
    isCourseApplied,
  };
}
