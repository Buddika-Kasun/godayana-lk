// src/lib/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  resume?: string;
}

interface UserState {
  profile: UserProfile | null;
  applications: string[];
  savedJobs: string[];
  isLoading: boolean;
}

const initialState: UserState = {
  profile: null,
  applications: [],
  savedJobs: [],
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setApplications: (state, action: PayloadAction<string[]>) => {
      state.applications = action.payload;
    },
    setSavedJobs: (state, action: PayloadAction<string[]>) => {
      state.savedJobs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.applications = [];
      state.savedJobs = [];
      state.isLoading = false;
    },
  },
});

export const {
  setProfile,
  setApplications,
  setSavedJobs,
  setLoading,
  clearUserData,
} = userSlice.actions;
export default userSlice.reducer;
