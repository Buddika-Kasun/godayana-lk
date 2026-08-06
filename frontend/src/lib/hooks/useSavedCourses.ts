// src/lib/hooks/useSavedCourses.ts
"use client";

import { useCallback, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  saveCourse,
  removeSavedCourse,
  toggleSaveCourse as toggleSaveCourseAction,
  fetchSavedCourses as fetchSavedCoursesThunk,
  fetchSavedCoursesCount as fetchSavedCoursesCountThunk,
  checkCourseSaved as checkCourseSavedThunk,
  removeAllSavedCourses as removeAllSavedCoursesThunk,
} from "../redux/actions/savedCoursesActions";
import {
  selectSavedCourseIds,
  selectSavedCourses,
  selectSavedCoursesCount,
  selectIsLoadingSavedCourses,
  selectIsTogglingSavedCourse,
  clearSavedCourses,
  setSavedCourseIds,
} from "../redux/slices/savedCoursesSlice";

interface UseSavedCoursesOptions {
  courseId?: string;
  autoFetch?: boolean;
}

export function useSavedCourses({
  courseId,
  autoFetch = true,
}: UseSavedCoursesOptions = {}) {
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  // Selectors
  const savedCourseIds = useAppSelector(selectSavedCourseIds);
  const savedCourses = useAppSelector(selectSavedCourses);
  const savedCoursesCount = useAppSelector(selectSavedCoursesCount);
  const isLoading = useAppSelector(selectIsLoadingSavedCourses);
  const isToggling = useAppSelector(selectIsTogglingSavedCourse);

  // Check if a specific course is saved
  const checkIfCourseSaved = useCallback(
    async (id: string) => {
      if (!id) return false;
      try {
        const result = await dispatch(checkCourseSavedThunk(id)).unwrap();
        return result.isSaved;
      } catch (error) {
        console.error("Error checking saved status:", error);
        return false;
      }
    },
    [dispatch],
  );

  // Get all saved courses
  const fetchSavedCourses = useCallback(
    async (page = 0, size = 50) => {
      try {
        const result = await dispatch(
          fetchSavedCoursesThunk({ page, size }),
        ).unwrap();
        return result;
      } catch (error) {
        console.error("Error fetching saved courses:", error);
        return [];
      }
    },
    [dispatch],
  );

  // Get saved courses count
  const fetchSavedCoursesCount = useCallback(async () => {
    try {
      const result = await dispatch(fetchSavedCoursesCountThunk()).unwrap();
      return result;
    } catch (error) {
      console.error("Error fetching saved courses count:", error);
      return 0;
    }
  }, [dispatch]);

  // Save a course
  const saveCourseHandler = useCallback(
    async (id: string) => {
      if (!id) return false;
      try {
        await dispatch(saveCourse(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch],
  );

  // Remove a saved course
  const removeSavedCourseHandler = useCallback(
    async (id: string) => {
      if (!id) return false;
      try {
        await dispatch(removeSavedCourse(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch],
  );

  // Toggle saved status
  const toggleSaveCourse = useCallback(
    async (id: string, currentStatus?: boolean) => {
      if (!id) return;
      const status = currentStatus ?? savedCourseIds.includes(id);
      try {
        await dispatch(
          toggleSaveCourseAction({ courseId: id, isSaved: status }),
        ).unwrap();
      } catch (error) {
        console.error("Error toggling save course:", error);
      }
    },
    [dispatch, savedCourseIds],
  );

  // Remove all saved courses
  const removeAllSavedCourses = useCallback(async () => {
    try {
      await dispatch(removeAllSavedCoursesThunk()).unwrap();
      return true;
    } catch (error) {
      console.error("Error removing all saved courses:", error);
      return false;
    }
  }, [dispatch]);

  // Clear saved courses from state
  const clearSavedCoursesState = useCallback(() => {
    dispatch(clearSavedCourses());
  }, [dispatch]);

  // Set saved course IDs manually
  const setSavedCourseIdsManually = useCallback(
    (ids: string[]) => {
      dispatch(setSavedCourseIds(ids));
    },
    [dispatch],
  );

  // Check if a course is saved (synchronous)
  const isCourseSaved = useCallback(
    (id: string) => {
      return savedCourseIds.includes(id);
    },
    [savedCourseIds],
  );

  // Auto-fetch when courseId is provided - with deduplication
  useEffect(() => {
    if (courseId && autoFetch && !hasFetched.current) {
      hasFetched.current = true;
      checkIfCourseSaved(courseId);
    }

    // Reset the flag when courseId changes
    return () => {
      hasFetched.current = false;
    };
  }, [courseId, autoFetch, checkIfCourseSaved]);

  return {
    // State
    isSaved: courseId ? savedCourseIds.includes(courseId) : false,
    savedCourseIds,
    savedCourses,
    savedCoursesCount,
    isLoading,
    isToggling,

    // Actions
    checkIfCourseSaved,
    fetchSavedCourses,
    fetchSavedCoursesCount,
    saveCourse: saveCourseHandler,
    removeSavedCourse: removeSavedCourseHandler,
    toggleSaveCourse,
    removeAllSavedCourses,
    clearSavedCoursesState,
    setSavedCourseIds: setSavedCourseIdsManually,
    isCourseSaved,
  };
}
