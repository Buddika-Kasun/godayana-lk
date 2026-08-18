// src/lib/redux/slices/appliedCoursesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppliedCoursesState {
  appliedCourseIds: string[];
  isLoading: boolean;
  isApplying: boolean;
  error: string | null;
}

const initialState: AppliedCoursesState = {
  appliedCourseIds: [],
  isLoading: false,
  isApplying: false,
  error: null,
};

const appliedCoursesSlice = createSlice({
  name: "appliedCourses",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setApplying: (state, action: PayloadAction<boolean>) => {
      state.isApplying = action.payload;
    },
    setAppliedCourseIds: (state, action: PayloadAction<string[]>) => {
      state.appliedCourseIds = action.payload;
    },
    addAppliedCourseId: (state, action: PayloadAction<string>) => {
      if (!state.appliedCourseIds.includes(action.payload)) {
        state.appliedCourseIds.push(action.payload);
      }
    },
    removeAppliedCourseId: (state, action: PayloadAction<string>) => {
      state.appliedCourseIds = state.appliedCourseIds.filter(
        (id) => id !== action.payload,
      );
    },
    clearAppliedCourseIds: (state) => {
      state.appliedCourseIds = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setApplying,
  setAppliedCourseIds,
  addAppliedCourseId,
  removeAppliedCourseId,
  clearAppliedCourseIds,
  setError,
} = appliedCoursesSlice.actions;

// Selectors
export const selectAppliedCourseIds = (state: {
  appliedCourses: AppliedCoursesState;
}) => state.appliedCourses.appliedCourseIds;
export const selectIsLoadingAppliedCourses = (state: {
  appliedCourses: AppliedCoursesState;
}) => state.appliedCourses.isLoading;
export const selectIsApplying = (state: {
  appliedCourses: AppliedCoursesState;
}) => state.appliedCourses.isApplying;
export const selectAppliedCoursesError = (state: {
  appliedCourses: AppliedCoursesState;
}) => state.appliedCourses.error;

export default appliedCoursesSlice.reducer;
