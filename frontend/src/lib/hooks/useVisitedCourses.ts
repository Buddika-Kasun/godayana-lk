// src/hooks/useVisitedCourses.ts
"use client";

import { useState, useEffect, useCallback } from "react";

const VISITED_COURSES_KEY = "visited_courses";

export function useVisitedCourses() {
  // Initialize state with a function to read from localStorage immediately
  const [visitedCourses, setVisitedCourses] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(VISITED_COURSES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Set(parsed);
      }
    } catch (error) {
      console.error("Error loading visited courses:", error);
    }
    return new Set();
  });

  // Mark a course as visited
  const markCourseAsVisited = useCallback((courseId: string) => {
    setVisitedCourses((prev) => {
      // If already visited, return the same set to avoid unnecessary updates
      if (prev.has(courseId)) return prev;

      const newSet = new Set(prev);
      newSet.add(courseId);

      // Save to localStorage
      try {
        localStorage.setItem(
          VISITED_COURSES_KEY,
          JSON.stringify(Array.from(newSet)),
        );
      } catch (error) {
        console.error("Error saving visited courses:", error);
      }

      return newSet;
    });
  }, []);

  // Check if a course has been visited
  const isCourseVisited = useCallback(
    (courseId: string) => {
      return visitedCourses.has(courseId);
    },
    [visitedCourses],
  );

  // Get all visited course IDs
  const getVisitedCourseIds = useCallback(() => {
    return Array.from(visitedCourses);
  }, [visitedCourses]);

  // Clear all visited courses
  const clearVisitedCourses = useCallback(() => {
    setVisitedCourses(new Set());
    try {
      localStorage.removeItem(VISITED_COURSES_KEY);
    } catch (error) {
      console.error("Error clearing visited courses:", error);
    }
  }, []);

  // Get visited courses count
  const getVisitedCount = useCallback(() => {
    return visitedCourses.size;
  }, [visitedCourses]);

  // Sync with localStorage when the component mounts or when another tab updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === VISITED_COURSES_KEY) {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setVisitedCourses(new Set(parsed));
        } catch (error) {
          console.error("Error syncing visited courses:", error);
        }
      }
    };

    // Listen for storage changes from other tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    visitedCourses,
    markCourseAsVisited,
    isCourseVisited,
    getVisitedCourseIds,
    clearVisitedCourses,
    getVisitedCount,
  };
}
