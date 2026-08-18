// src/lib/hooks/useAppliedJobs.ts
"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  fetchAppliedJobIds,
  checkJobApplied,
  applyForJob,
  withdrawApplication,
  clearAppliedJobs,
} from "../redux/actions/appliedJobsActions";
import {
  selectAppliedJobIds,
  selectIsLoadingAppliedJobs,
  selectIsApplying,
} from "../redux/slices/appliedJobsSlice";
import { useAuth } from "./useAuth";

interface UseAppliedJobsOptions {
  jobId?: string;
  autoFetch?: boolean;
}

export function useAppliedJobs({
  jobId,
  autoFetch = false,
}: UseAppliedJobsOptions = {}) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const appliedJobIds = useAppSelector(selectAppliedJobIds);
  const isLoading = useAppSelector(selectIsLoadingAppliedJobs);
  const isApplying = useAppSelector(selectIsApplying);

  // Check if a specific job is applied
  const checkIfApplied = useCallback(
    async (id: string) => {
      if (!id || !isAuthenticated) return false;
      try {
        const result = await dispatch(checkJobApplied(id)).unwrap();
        return result.hasApplied;
      } catch (error) {
        console.error("Error checking applied status:", error);
        return false;
      }
    },
    [dispatch, isAuthenticated],
  );

  // Fetch all applied job IDs
  const fetchAppliedJobs = useCallback(
    async (page = 0, size = 100) => {
      if (!isAuthenticated) return [];
      try {
        const result = await dispatch(
          fetchAppliedJobIds({ page, size }),
        ).unwrap();
        return result;
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return [];
      }
    },
    [dispatch, isAuthenticated],
  );

  // Apply for a job
  const applyJob = useCallback(
    async (id: string, coverLetter?: string) => {
      if (!id || !isAuthenticated) return false;
      try {
        await dispatch(applyForJob({ jobId: id, coverLetter })).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch, isAuthenticated],
  );

  // Withdraw an application
  const withdrawJobApplication = useCallback(
    async (applicationId: string) => {
      if (!applicationId || !isAuthenticated) return false;
      try {
        await dispatch(withdrawApplication(applicationId)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch, isAuthenticated],
  );

  // Clear applied jobs from state
  const clearAppliedJobsState = useCallback(() => {
    dispatch(clearAppliedJobs());
  }, [dispatch]);

  // Check if a job is applied (synchronous)
  const isJobApplied = useCallback(
    (id: string) => {
      return appliedJobIds.includes(id);
    },
    [appliedJobIds],
  );

  // Auto-fetch when jobId is provided
  useEffect(() => {
    if (jobId && autoFetch && isAuthenticated) {
      checkIfApplied(jobId);
    }
  }, [jobId, autoFetch, isAuthenticated, checkIfApplied]);

  return {
    // State
    isApplied: jobId ? appliedJobIds.includes(jobId) : false,
    appliedJobIds,
    isLoading,
    isApplying,

    // Actions
    checkIfApplied,
    fetchAppliedJobs,
    applyJob,
    withdrawJobApplication,
    clearAppliedJobsState,
    isJobApplied,
  };
}
