// src/hooks/useVisitedJobs.ts
"use client";

import { useState, useEffect, useCallback } from "react";

const VISITED_JOBS_KEY = "visited_jobs";

export function useVisitedJobs() {
  // Initialize state with a function to read from localStorage immediately
  const [visitedJobs, setVisitedJobs] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(VISITED_JOBS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Set(parsed);
      }
    } catch (error) {
      console.error("Error loading visited jobs:", error);
    }
    return new Set();
  });

  // Mark a job as visited
  const markJobAsVisited = useCallback((jobId: string) => {
    setVisitedJobs((prev) => {
      // If already visited, return the same set to avoid unnecessary updates
      if (prev.has(jobId)) return prev;

      const newSet = new Set(prev);
      newSet.add(jobId);

      // Save to localStorage
      try {
        localStorage.setItem(
          VISITED_JOBS_KEY,
          JSON.stringify(Array.from(newSet)),
        );
      } catch (error) {
        console.error("Error saving visited jobs:", error);
      }

      return newSet;
    });
  }, []);

  // Check if a job has been visited
  const isJobVisited = useCallback(
    (jobId: string) => {
      return visitedJobs.has(jobId);
    },
    [visitedJobs],
  );

  // Get all visited job IDs
  const getVisitedJobIds = useCallback(() => {
    return Array.from(visitedJobs);
  }, [visitedJobs]);

  // Clear all visited jobs
  const clearVisitedJobs = useCallback(() => {
    setVisitedJobs(new Set());
    try {
      localStorage.removeItem(VISITED_JOBS_KEY);
    } catch (error) {
      console.error("Error clearing visited jobs:", error);
    }
  }, []);

  // Sync with localStorage when the component mounts or when another tab updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === VISITED_JOBS_KEY) {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setVisitedJobs(new Set(parsed));
        } catch (error) {
          console.error("Error syncing visited jobs:", error);
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
    visitedJobs,
    markJobAsVisited,
    isJobVisited,
    getVisitedJobIds,
    clearVisitedJobs,
  };
}
