// src/lib/redux/actions/savedJobsActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  setLoading,
  setToggling,
  setSavedJobIds,
  addSavedJobId,
  removeSavedJobId,
  setSavedJobs,
  setSavedJobsCount,
  setError,
} from "../slices/savedJobsSlice";
import { SavedJobResponse, seekerJobAPI } from "@/lib/api/endpoints/seeker/seekerJobEndpoints";

// Fetch saved jobs
export const fetchSavedJobs = createAsyncThunk(
  "savedJobs/fetchSavedJobs",
  async (params: { page?: number; size?: number }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await seekerJobAPI.save.getSavedJobs({
        page: params.page || 0,
        size: params.size || 50,
      });
      if (response.data.success && response.data.data) {
        const content = response.data.data.content || [];
        const jobIds = content.map((job: SavedJobResponse) => job.jobId);
        dispatch(setSavedJobs(content));
        dispatch(setSavedJobIds(jobIds));
        dispatch(setSavedJobsCount(response.data.data.totalElements || 0));
        return content;
      }
      return [];
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      dispatch(setError("Failed to load saved jobs"));
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Fetch saved jobs count
export const fetchSavedJobsCount = createAsyncThunk(
  "savedJobs/fetchSavedJobsCount",
  async (_, { dispatch }) => {
    try {
      const response = await seekerJobAPI.save.getSavedJobsCount();
      if (response.data.success) {
        const count = response.data.data ?? 0;
        dispatch(setSavedJobsCount(count));
        return count;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching saved jobs count:", error);
      return 0;
    }
  },
);

// Check if job is saved
export const checkJobSaved = createAsyncThunk(
  "savedJobs/checkJobSaved",
  async (jobId: string, { dispatch }) => {
    try {
      const response = await seekerJobAPI.save.isJobSaved(jobId);
      if (response.data.success) {
        const isSaved = response.data.data ?? false;
        if (isSaved) {
          dispatch(addSavedJobId(jobId));
        } else {
          dispatch(removeSavedJobId(jobId));
        }
        return { jobId, isSaved };
      }
      return { jobId, isSaved: false };
    } catch (error) {
      console.error("Error checking saved status:", error);
      return { jobId, isSaved: false };
    }
  },
);

// Save a job
export const saveJob = createAsyncThunk(
  "savedJobs/saveJob",
  async (jobId: string, { dispatch }) => {
    dispatch(setToggling(true));
    try {
      const response = await seekerJobAPI.save.saveJob(jobId);
      if (response.data.success) {
        dispatch(addSavedJobId(jobId));
        toast.success("Job saved successfully");
        // Refresh count
        await dispatch(fetchSavedJobsCount());
        return jobId;
      } else {
        toast.error(response.data.message || "Failed to save job");
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job");
      throw error;
    } finally {
      dispatch(setToggling(false));
    }
  },
);

// Remove a saved job
export const removeSavedJob = createAsyncThunk(
  "savedJobs/removeSavedJob",
  async (jobId: string, { dispatch }) => {
    dispatch(setToggling(true));
    try {
      const response = await seekerJobAPI.save.removeSavedJob(jobId);
      if (response.data.success) {
        dispatch(removeSavedJobId(jobId));
        toast.success("Job removed from saved");
        // Refresh count
        await dispatch(fetchSavedJobsCount());
        return jobId;
      } else {
        toast.error(response.data.message || "Failed to remove saved job");
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error("Failed to remove saved job");
      throw error;
    } finally {
      dispatch(setToggling(false));
    }
  },
);

// Toggle save job
export const toggleSaveJob = createAsyncThunk(
  "savedJobs/toggleSaveJob",
  async (
    { jobId, isSaved }: { jobId: string; isSaved: boolean },
    { dispatch },
  ) => {
    if (isSaved) {
      await dispatch(removeSavedJob(jobId)).unwrap();
      return { jobId, isSaved: false };
    } else {
      await dispatch(saveJob(jobId)).unwrap();
      return { jobId, isSaved: true };
    }
  },
);

// Remove all saved jobs
export const removeAllSavedJobs = createAsyncThunk(
  "savedJobs/removeAllSavedJobs",
  async (_, { dispatch }) => {
    try {
      const response = await seekerJobAPI.save.removeAllSavedJobs();
      if (response.data.success) {
        dispatch(setSavedJobIds([]));
        dispatch(setSavedJobs([]));
        dispatch(setSavedJobsCount(0));
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
  },
);
