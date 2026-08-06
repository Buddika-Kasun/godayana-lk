// src/lib/redux/actions/savedCoursesActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  setLoading,
  setToggling,
  setSavedCourseIds,
  addSavedCourseId,
  removeSavedCourseId,
  setSavedCourses,
  setSavedCoursesCount,
  setError,
} from "../slices/savedCoursesSlice";
import {
  SavedCourseResponse,
  seekerCourseAPI,
} from "@/lib/api/endpoints/seeker/seekerCourseEndpoints";

// Fetch saved courses
export const fetchSavedCourses = createAsyncThunk(
  "savedCourses/fetchSavedCourses",
  async (params: { page?: number; size?: number }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await seekerCourseAPI.save.getSavedCourses({
        page: params.page || 0,
        size: params.size || 50,
      });
      if (response.data.success && response.data.data) {
        const content = response.data.data.content || [];
        const courseIds = content.map(
          (course: SavedCourseResponse) => course.courseId,
        );
        dispatch(setSavedCourses(content));
        dispatch(setSavedCourseIds(courseIds));
        dispatch(setSavedCoursesCount(response.data.data.totalElements || 0));
        return content;
      }
      return [];
    } catch (error) {
      console.error("Error fetching saved courses:", error);
      dispatch(setError("Failed to load saved courses"));
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Fetch saved courses count
export const fetchSavedCoursesCount = createAsyncThunk(
  "savedCourses/fetchSavedCoursesCount",
  async (_, { dispatch }) => {
    try {
      const response = await seekerCourseAPI.save.getSavedCoursesCount();
      if (response.data.success) {
        const count = response.data.data ?? 0;
        dispatch(setSavedCoursesCount(count));
        return count;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching saved courses count:", error);
      return 0;
    }
  },
);

// Check if course is saved
export const checkCourseSaved = createAsyncThunk(
  "savedCourses/checkCourseSaved",
  async (courseId: string, { dispatch }) => {
    try {
      const response = await seekerCourseAPI.save.isCourseSaved(courseId);
      if (response.data.success) {
        const isSaved = response.data.data ?? false;
        if (isSaved) {
          dispatch(addSavedCourseId(courseId));
        } else {
          dispatch(removeSavedCourseId(courseId));
        }
        return { courseId, isSaved };
      }
      return { courseId, isSaved: false };
    } catch (error) {
      console.error("Error checking saved status:", error);
      return { courseId, isSaved: false };
    }
  },
);

// Save a course
export const saveCourse = createAsyncThunk(
  "savedCourses/saveCourse",
  async (courseId: string, { dispatch }) => {
    dispatch(setToggling(true));
    try {
      const response = await seekerCourseAPI.save.saveCourse(courseId);
      if (response.data.success) {
        dispatch(addSavedCourseId(courseId));
        toast.success("Course saved successfully");
        // Refresh count
        await dispatch(fetchSavedCoursesCount());
        return courseId;
      } else {
        toast.error(response.data.message || "Failed to save course");
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course");
      throw error;
    } finally {
      dispatch(setToggling(false));
    }
  },
);

// Remove a saved course
export const removeSavedCourse = createAsyncThunk(
  "savedCourses/removeSavedCourse",
  async (courseId: string, { dispatch }) => {
    dispatch(setToggling(true));
    try {
      const response = await seekerCourseAPI.save.removeSavedCourse(courseId);
      if (response.data.success) {
        dispatch(removeSavedCourseId(courseId));
        toast.success("Course removed from saved");
        // Refresh count
        await dispatch(fetchSavedCoursesCount());
        return courseId;
      } else {
        toast.error(response.data.message || "Failed to remove saved course");
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing saved course:", error);
      toast.error("Failed to remove saved course");
      throw error;
    } finally {
      dispatch(setToggling(false));
    }
  },
);

// Toggle save course
export const toggleSaveCourse = createAsyncThunk(
  "savedCourses/toggleSaveCourse",
  async (
    { courseId, isSaved }: { courseId: string; isSaved: boolean },
    { dispatch },
  ) => {
    if (isSaved) {
      await dispatch(removeSavedCourse(courseId)).unwrap();
      return { courseId, isSaved: false };
    } else {
      await dispatch(saveCourse(courseId)).unwrap();
      return { courseId, isSaved: true };
    }
  },
);

// Remove all saved courses
export const removeAllSavedCourses = createAsyncThunk(
  "savedCourses/removeAllSavedCourses",
  async (_, { dispatch }) => {
    try {
      const response = await seekerCourseAPI.save.removeAllSavedCourses();
      if (response.data.success) {
        dispatch(setSavedCourseIds([]));
        dispatch(setSavedCourses([]));
        dispatch(setSavedCoursesCount(0));
        toast.success("All saved courses removed");
        return true;
      } else {
        toast.error(response.data.message || "Failed to remove saved courses");
        return false;
      }
    } catch (error) {
      console.error("Error removing all saved courses:", error);
      toast.error("Failed to remove saved courses");
      return false;
    }
  },
);
