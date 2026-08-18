// src/lib/redux/slices/savedJobsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SavedJobResponse } from "@/lib/api/endpoints/seeker/seekerJobEndpoints";

export interface SavedJobsState {
  savedJobIds: string[];
  savedJobs: SavedJobResponse[];
  savedJobsCount: number;
  isLoading: boolean;
  isToggling: boolean;
  error: string | null;
}

const initialState: SavedJobsState = {
  savedJobIds: [],
  savedJobs: [],
  savedJobsCount: 0,
  isLoading: false,
  isToggling: false,
  error: null,
};

const savedJobsSlice = createSlice({
  name: "savedJobs",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setToggling: (state, action: PayloadAction<boolean>) => {
      state.isToggling = action.payload;
    },
    setSavedJobIds: (state, action: PayloadAction<string[]>) => {
      state.savedJobIds = action.payload;
    },
    addSavedJobId: (state, action: PayloadAction<string>) => {
      if (!state.savedJobIds.includes(action.payload)) {
        state.savedJobIds.push(action.payload);
      }
    },
    removeSavedJobId: (state, action: PayloadAction<string>) => {
      state.savedJobIds = state.savedJobIds.filter((id) => id !== action.payload);
    },
    setSavedJobs: (state, action: PayloadAction<SavedJobResponse[]>) => {
      state.savedJobs = action.payload;
    },
    setSavedJobsCount: (state, action: PayloadAction<number>) => {
      state.savedJobsCount = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSavedJobs: (state) => {
      state.savedJobIds = [];
      state.savedJobs = [];
      state.savedJobsCount = 0;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setToggling,
  setSavedJobIds,
  addSavedJobId,
  removeSavedJobId,
  setSavedJobs,
  setSavedJobsCount,
  setError,
  clearSavedJobs,
} = savedJobsSlice.actions;

// Selectors
export const selectSavedJobIds = (state: { savedJobs: SavedJobsState }) =>
  state.savedJobs.savedJobIds;
export const selectSavedJobs = (state: { savedJobs: SavedJobsState }) =>
  state.savedJobs.savedJobs;
export const selectSavedJobsCount = (state: { savedJobs: SavedJobsState }) =>
  state.savedJobs.savedJobsCount;
export const selectIsLoadingSavedJobs = (state: { savedJobs: SavedJobsState }) =>
  state.savedJobs.isLoading;
export const selectIsTogglingSavedJob = (state: { savedJobs: SavedJobsState }) =>
  state.savedJobs.isToggling;
export const selectSavedJobsError = (state: { savedJobs: SavedJobsState }) =>
  state.savedJobs.error;

export default savedJobsSlice.reducer;