// src/lib/redux/slices/appliedJobsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppliedJobsState {
  appliedJobIds: string[];
  isLoading: boolean;
  isApplying: boolean;
  error: string | null;
}

const initialState: AppliedJobsState = {
  appliedJobIds: [],
  isLoading: false,
  isApplying: false,
  error: null,
};

const appliedJobsSlice = createSlice({
  name: "appliedJobs",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setApplying: (state, action: PayloadAction<boolean>) => {
      state.isApplying = action.payload;
    },
    setAppliedJobIds: (state, action: PayloadAction<string[]>) => {
      state.appliedJobIds = action.payload;
    },
    addAppliedJobId: (state, action: PayloadAction<string>) => {
      if (!state.appliedJobIds.includes(action.payload)) {
        state.appliedJobIds.push(action.payload);
      }
    },
    removeAppliedJobId: (state, action: PayloadAction<string>) => {
      state.appliedJobIds = state.appliedJobIds.filter(
        (id) => id !== action.payload,
      );
    },
    clearAppliedJobIds: (state) => {
      state.appliedJobIds = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setApplying,
  setAppliedJobIds,
  addAppliedJobId,
  removeAppliedJobId,
  clearAppliedJobIds,
  setError,
} = appliedJobsSlice.actions;

// Selectors
export const selectAppliedJobIds = (state: { appliedJobs: AppliedJobsState }) =>
  state.appliedJobs.appliedJobIds;
export const selectIsLoadingAppliedJobs = (state: {
  appliedJobs: AppliedJobsState;
}) => state.appliedJobs.isLoading;
export const selectIsApplying = (state: { appliedJobs: AppliedJobsState }) =>
  state.appliedJobs.isApplying;
export const selectAppliedJobsError = (state: {
  appliedJobs: AppliedJobsState;
}) => state.appliedJobs.error;

export default appliedJobsSlice.reducer;
