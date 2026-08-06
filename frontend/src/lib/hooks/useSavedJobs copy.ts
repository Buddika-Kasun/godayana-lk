// src/lib/hooks/useSavedJobs.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import seekerSavedJobAPI, { SavedJobResponse } from "../api/endpoints/seeker/seekerJobEndpoints";
interface UseSavedJobsOptions {
  jobId?: string;
  autoFetch?: boolean;
}

export function useSavedJobs({
  jobId,
  autoFetch = true,
}: UseSavedJobsOptions = {}) {
  const [isSaved, setIsSaved] = useState(false);
  const [savedJobs, setSavedJobs] = useState<SavedJobResponse[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Check if a specific job is saved
  const checkIfJobSaved = useCallback(async (id: string) => {
    if (!id) return;
    try {
      const response = await seekerSavedJobAPI.isJobSaved(id);
      if (response.data.success) {
        setIsSaved(response.data.data ?? false);
        return response.data.data ?? false;
      }
      return false;
    } catch (error) {
      console.error("Error checking saved status:", error);
      return false;
    }
  }, []);

  // Get all saved jobs
  const fetchSavedJobs = useCallback(async (page = 0, size = 10) => {
    setIsLoading(true);
    try {
      const response = await seekerSavedJobAPI.getSavedJobs({ page, size });
      if (response.data.success && response.data.data) {
        setSavedJobs(response.data.data.content || []);
        setSavedJobsCount(response.data.data.totalElements || 0);
        return response.data.data.content;
      }
      return [];
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get saved jobs count
  const fetchSavedJobsCount = useCallback(async () => {
    try {
      const response = await seekerSavedJobAPI.getSavedJobsCount();
      if (response.data.success) {
        setSavedJobsCount(response.data.data ?? 0);
        return response.data.data ?? 0;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching saved jobs count:", error);
      return 0;
    }
  }, []);

  // Save a job
  const saveJob = useCallback(
    async (id: string) => {
      if (!id) return false;
      setIsToggling(true);
      try {
        const response = await seekerSavedJobAPI.saveJob(id);
        if (response.data.success) {
          setIsSaved(true);
          toast.success("Job saved successfully");
          // Refresh count
          await fetchSavedJobsCount();
          return true;
        } else {
          toast.error(response.data.message || "Failed to save job");
          return false;
        }
      } catch (error) {
        console.error("Error saving job:", error);
        toast.error("Failed to save job");
        return false;
      } finally {
        setIsToggling(false);
      }
    },
    [fetchSavedJobsCount],
  );

  // Remove a saved job
  const removeSavedJob = useCallback(
    async (id: string) => {
      if (!id) return false;
      setIsToggling(true);
      try {
        const response = await seekerSavedJobAPI.removeSavedJob(id);
        if (response.data.success) {
          setIsSaved(false);
          toast.success("Job removed from saved");
          // Refresh count
          await fetchSavedJobsCount();
          return true;
        } else {
          toast.error(response.data.message || "Failed to remove saved job");
          return false;
        }
      } catch (error) {
        console.error("Error removing saved job:", error);
        toast.error("Failed to remove saved job");
        return false;
      } finally {
        setIsToggling(false);
      }
    },
    [fetchSavedJobsCount],
  );

  // Toggle saved status
  const toggleSaveJob = useCallback(
    async (id: string, currentStatus?: boolean) => {
      const status = currentStatus ?? isSaved;
      if (!status) {
        return await removeSavedJob(id);
      } else {
        return await saveJob(id);
      }
    },
    [isSaved, saveJob, removeSavedJob],
  );

  // Remove all saved jobs
  const removeAllSavedJobs = useCallback(async () => {
    try {
      const response = await seekerSavedJobAPI.removeAllSavedJobs();
      if (response.data.success) {
        setSavedJobs([]);
        setSavedJobsCount(0);
        setIsSaved(false);
        toast.success("All saved jobs removed");
        return true;
      } else {
        toast.error(response.data.message || "Failed to remove saved jobs");
        return false;
      }
    } catch (error) {
      console.error("Error removing all saved jobs:", error);
      toast.error("Failed to remove saved jobs");
      return false;
    }
  }, []);

  // Auto-fetch when jobId is provided
  useEffect(() => {
    if (jobId && autoFetch) {
      checkIfJobSaved(jobId);
    }
  }, [jobId, autoFetch, checkIfJobSaved]);

  return {
    // State
    isSaved,
    savedJobs,
    savedJobsCount,
    isLoading,
    isToggling,

    // Actions
    checkIfJobSaved,
    fetchSavedJobs,
    fetchSavedJobsCount,
    saveJob,
    removeSavedJob,
    toggleSaveJob,
    removeAllSavedJobs,

    // Setter (for manual control)
    setIsSaved,
  };
}
