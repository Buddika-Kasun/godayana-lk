// src/lib/redux/slices/savedCoursesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SavedCourseResponse } from "@/lib/api/endpoints/seeker/seekerCourseEndpoints";

export interface SavedCoursesState {
  savedCourseIds: string[];
  savedCourses: SavedCourseResponse[];
  savedCoursesCount: number;
  isLoading: boolean;
  isToggling: boolean;
  error: string | null;
}

const initialState: SavedCoursesState = {
  savedCourseIds: [],
  savedCourses: [],
  savedCoursesCount: 0,
  isLoading: false,
  isToggling: false,
  error: null,
};

const savedCoursesSlice = createSlice({
  name: "savedCourses",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setToggling: (state, action: PayloadAction<boolean>) => {
      state.isToggling = action.payload;
    },
    setSavedCourseIds: (state, action: PayloadAction<string[]>) => {
      state.savedCourseIds = action.payload;
    },
    addSavedCourseId: (state, action: PayloadAction<string>) => {
      if (!state.savedCourseIds.includes(action.payload)) {
        state.savedCourseIds.push(action.payload);
      }
    },
    removeSavedCourseId: (state, action: PayloadAction<string>) => {
      state.savedCourseIds = state.savedCourseIds.filter(
        (id) => id !== action.payload,
      );
    },
    setSavedCourses: (state, action: PayloadAction<SavedCourseResponse[]>) => {
      state.savedCourses = action.payload;
    },
    setSavedCoursesCount: (state, action: PayloadAction<number>) => {
      state.savedCoursesCount = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSavedCourses: (state) => {
      state.savedCourseIds = [];
      state.savedCourses = [];
      state.savedCoursesCount = 0;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setToggling,
  setSavedCourseIds,
  addSavedCourseId,
  removeSavedCourseId,
  setSavedCourses,
  setSavedCoursesCount,
  setError,
  clearSavedCourses,
} = savedCoursesSlice.actions;

// Selectors
export const selectSavedCourseIds = (state: {
  savedCourses: SavedCoursesState;
}) => state.savedCourses.savedCourseIds;
export const selectSavedCourses = (state: {
  savedCourses: SavedCoursesState;
}) => state.savedCourses.savedCourses;
export const selectSavedCoursesCount = (state: {
  savedCourses: SavedCoursesState;
}) => state.savedCourses.savedCoursesCount;
export const selectIsLoadingSavedCourses = (state: {
  savedCourses: SavedCoursesState;
}) => state.savedCourses.isLoading;
export const selectIsTogglingSavedCourse = (state: {
  savedCourses: SavedCoursesState;
}) => state.savedCourses.isToggling;
export const selectSavedCoursesError = (state: {
  savedCourses: SavedCoursesState;
}) => state.savedCourses.error;

export default savedCoursesSlice.reducer;
