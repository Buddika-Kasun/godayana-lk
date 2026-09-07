// src/lib/redux/actions/appliedCoursesActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  setLoading,
  setApplying,
  setAppliedCourseIds,
  addAppliedCourseId,
  removeAppliedCourseId,
  setError,
} from "../slices/appliedCoursesSlice";
import { seekerCourseAPI } from "@/lib/api/endpoints/seeker/seekerCourseEndpoints";
import { getErrorMessage } from "@/lib/utils/errorMessageUtils";

// Fetch all applied course IDs
export const fetchAppliedCourseIds = createAsyncThunk(
  "appliedCourses/fetchAppliedCourseIds",
  async (
    params: { page?: number; size?: number } = { page: 0, size: 100 },
    { dispatch },
  ) => {
    dispatch(setLoading(true));
    try {
      const response = await seekerCourseAPI.application.getMyApplicationCourseIds({
        page: params.page || 0,
        size: params.size || 100,
      });
      if (response.data.success && response.data.data) {
        const courseIds = response.data.data.content || [];
        dispatch(setAppliedCourseIds(courseIds));
        return courseIds;
      }
      return [];
    } catch (error) {
      console.error("Error fetching applied course IDs:", error);
      const errorMessage = getErrorMessage(error);
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Check if user has applied for a specific course
export const checkCourseApplied = createAsyncThunk(
  "appliedCourses/checkCourseApplied",
  async (courseId: string, { dispatch }) => {
    try {
      const response = await seekerCourseAPI.application.hasApplied(courseId);
      if (response.data.success) {
        const hasApplied = response.data.data ?? false;
        if (hasApplied) {
          dispatch(addAppliedCourseId(courseId));
        } else {
          dispatch(removeAppliedCourseId(courseId));
        }
        return { courseId, hasApplied };
      }
      return { courseId, hasApplied: false };
    } catch (error) {
      console.error("Error checking applied status:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      return { courseId, hasApplied: false };
    }
  },
);

// Apply for a course
export const applyForCourse = createAsyncThunk(
  "appliedCourses/applyForCourse",
  async (
    { courseId }: { courseId: string },
    { dispatch },
  ) => {
    dispatch(setApplying(true));
    try {
      const response = await seekerCourseAPI.application.applyForCourse(
        courseId,
      );
      if (response.data.success) {
        dispatch(addAppliedCourseId(courseId));
        toast.success("Application submitted successfully!");
        return courseId;
      } else {
        const errorMessage =
          response.data.message || "Failed to submit application";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error applying for course:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setApplying(false));
    }
  },
);

// Withdraw an application
export const withdrawCourseApplication = createAsyncThunk(
  "appliedCourses/withdrawCourseApplication",
  async (applicationId: string, { dispatch }) => {
    dispatch(setApplying(true));
    try {
      const response =
        await seekerCourseAPI.application.withdrawApplication(applicationId);
      if (response.data.success) {
        // Refresh the list after withdrawal
        await dispatch(fetchAppliedCourseIds({ page: 0, size: 100 }));
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

// Clear applied courses
export const clearAppliedCourses = createAsyncThunk(
  "appliedCourses/clearAppliedCourses",
  async (_, { dispatch }) => {
    dispatch(setAppliedCourseIds([]));
    // toast.success("Applied courses cleared");
  },
);
