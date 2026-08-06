// src/lib/hooks/useSavedJobs.ts
"use client";

import { useCallback, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  saveJob,
  removeSavedJob,
  toggleSaveJob as toggleSaveJobAction,
  fetchSavedJobs as fetchSavedJobsThunk,
  fetchSavedJobsCount as fetchSavedJobsCountThunk,
  checkJobSaved as checkJobSavedThunk,
  removeAllSavedJobs as removeAllSavedJobsThunk,
} from "../redux/actions/savedJobsActions";
import {
  selectSavedJobIds,
  selectSavedJobs,
  selectSavedJobsCount,
  selectIsLoadingSavedJobs,
  selectIsTogglingSavedJob,
  clearSavedJobs,
  setSavedJobIds,
} from "../redux/slices/savedJobsSlice";

interface UseSavedJobsOptions {
  jobId?: string;
  autoFetch?: boolean;
}

export function useSavedJobs({
  jobId,
  autoFetch = true,
}: UseSavedJobsOptions = {}) {
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  // Selectors
  const savedJobIds = useAppSelector(selectSavedJobIds);
  const savedJobs = useAppSelector(selectSavedJobs);
  const savedJobsCount = useAppSelector(selectSavedJobsCount);
  const isLoading = useAppSelector(selectIsLoadingSavedJobs);
  const isToggling = useAppSelector(selectIsTogglingSavedJob);

  // Check if a specific job is saved
  const checkIfJobSaved = useCallback(
    async (id: string) => {
      if (!id) return false;
      try {
        const result = await dispatch(checkJobSavedThunk(id)).unwrap();
        return result.isSaved;
      } catch (error) {
        console.error("Error checking saved status:", error);
        return false;
      }
    },
    [dispatch],
  );

  // Get all saved jobs
  const fetchSavedJobs = useCallback(
    async (page = 0, size = 50) => {
      try {
        const result = await dispatch(
          fetchSavedJobsThunk({ page, size }),
        ).unwrap();
        return result;
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        return [];
      }
    },
    [dispatch],
  );

  // Get saved jobs count
  const fetchSavedJobsCount = useCallback(async () => {
    try {
      const result = await dispatch(fetchSavedJobsCountThunk()).unwrap();
      return result;
    } catch (error) {
      console.error("Error fetching saved jobs count:", error);
      return 0;
    }
  }, [dispatch]);

  // Save a job
  const saveJobHandler = useCallback(
    async (id: string) => {
      if (!id) return false;
      try {
        await dispatch(saveJob(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch],
  );

  // Remove a saved job
  const removeSavedJobHandler = useCallback(
    async (id: string) => {
      if (!id) return false;
      try {
        await dispatch(removeSavedJob(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch],
  );

  // Toggle saved status
  const toggleSaveJob = useCallback(
    async (id: string, currentStatus?: boolean) => {
      if (!id) return;
      const status = currentStatus ?? savedJobIds.includes(id);
      try {
        await dispatch(
          toggleSaveJobAction({ jobId: id, isSaved: status }),
        ).unwrap();
      } catch (error) {
        console.error("Error toggling save job:", error);
      }
    },
    [dispatch, savedJobIds],
  );

  // Remove all saved jobs
  const removeAllSavedJobs = useCallback(async () => {
    try {
      await dispatch(removeAllSavedJobsThunk()).unwrap();
      return true;
    } catch (error) {
      console.error("Error removing all saved jobs:", error);
      return false;
    }
  }, [dispatch]);

  // Clear saved jobs from state
  const clearSavedJobsState = useCallback(() => {
    dispatch(clearSavedJobs());
  }, [dispatch]);

  // Set saved job IDs manually
  const setSavedJobIdsManually = useCallback(
    (ids: string[]) => {
      dispatch(setSavedJobIds(ids));
    },
    [dispatch],
  );

  // Check if a job is saved (synchronous)
  const isJobSaved = useCallback(
    (id: string) => {
      return savedJobIds.includes(id);
    },
    [savedJobIds],
  );

  // Auto-fetch when jobId is provided - with deduplication
  useEffect(() => {
    if (jobId && autoFetch && !hasFetched.current) {
      hasFetched.current = true;
      checkIfJobSaved(jobId);
    }

    // Reset the flag when jobId changes
    return () => {
      hasFetched.current = false;
    };
  }, [jobId, autoFetch, checkIfJobSaved]);

  return {
    // State
    isSaved: jobId ? savedJobIds.includes(jobId) : false,
    savedJobIds,
    savedJobs,
    savedJobsCount,
    isLoading,
    isToggling,

    // Actions
    checkIfJobSaved,
    fetchSavedJobs,
    fetchSavedJobsCount,
    saveJob: saveJobHandler,
    removeSavedJob: removeSavedJobHandler,
    toggleSaveJob,
    removeAllSavedJobs,
    clearSavedJobsState,
    setSavedJobIds: setSavedJobIdsManually,
    isJobSaved,
  };
}
