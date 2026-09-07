// src/lib/redux/actions/appliedJobsActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  setLoading,
  setApplying,
  setAppliedJobIds,
  addAppliedJobId,
  removeAppliedJobId,
  setError,
} from "../slices/appliedJobsSlice";
import { seekerJobAPI } from "@/lib/api/endpoints/seeker/seekerJobEndpoints";
import { getErrorMessage } from "@/lib/utils/errorMessageUtils";

// Fetch all applied job IDs
export const fetchAppliedJobIds = createAsyncThunk(
  "appliedJobs/fetchAppliedJobIds",
  async (
    params: { page?: number; size?: number } = { page: 0, size: 100 },
    { dispatch },
  ) => {
    dispatch(setLoading(true));
    try {
      const response = await seekerJobAPI.application.getMyApplicationJobIds({
        page: params.page || 0,
        size: params.size || 100,
      });
      if (response.data.success && response.data.data) {
        const jobIds = response.data.data.content || [];
        dispatch(setAppliedJobIds(jobIds));
        return jobIds;
      }
      return [];
    } catch (error) {
      console.error("Error fetching applied job IDs:", error);
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Check if user has applied for a specific job
export const checkJobApplied = createAsyncThunk(
  "appliedJobs/checkJobApplied",
  async (jobId: string, { dispatch }) => {
    try {
      const response = await seekerJobAPI.application.hasApplied(jobId);
      if (response.data.success) {
        const hasApplied = response.data.data ?? false;
        if (hasApplied) {
          dispatch(addAppliedJobId(jobId));
        } else {
          dispatch(removeAppliedJobId(jobId));
        }
        return { jobId, hasApplied };
      }
      return { jobId, hasApplied: false };
    } catch (error) {
      console.error("Error checking applied status:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      return { jobId, hasApplied: false };
    }
  },
);

// Apply for a job
export const applyForJob = createAsyncThunk(
  "appliedJobs/applyForJob",
  async (
    { jobId, coverLetter }: { jobId: string; coverLetter?: string },
    { dispatch },
  ) => {
    dispatch(setApplying(true));
    try {
      const response = await seekerJobAPI.application.applyForJob(
        jobId,
        coverLetter,
      );
      if (response.data.success) {
        dispatch(addAppliedJobId(jobId));
        toast.success("Application submitted successfully!");
        return jobId;
      } else {
        const errorMessage =
          response.data.message || "Failed to submit application";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      // Extract and show the specific error message
      const errorMessage = getErrorMessage(error);
      // Show the specific error message from the backend (e.g., "You have already applied for this job")
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setApplying(false));
    }
  },
);

// Withdraw an application
export const withdrawApplication = createAsyncThunk(
  "appliedJobs/withdrawApplication",
  async (applicationId: string, { dispatch }) => {
    dispatch(setApplying(true));
    try {
      const response =
        await seekerJobAPI.application.withdrawApplication(applicationId);
      if (response.data.success) {
        // Refresh the list after withdrawal
        await dispatch(fetchAppliedJobIds({ page: 0, size: 100 }));
        toast.success("Application withdrawn successfully");
        return true;
      } else {
        const errorMessage =
          response.data.message || "Failed to withdraw application";
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error withdrawing application:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch(setApplying(false));
    }
  },
);

// Clear applied jobs
export const clearAppliedJobs = createAsyncThunk(
  "appliedJobs/clearAppliedJobs",
  async (_, { dispatch }) => {
    dispatch(setAppliedJobIds([]));
    // toast.success("Applied jobs cleared");
  },
);
