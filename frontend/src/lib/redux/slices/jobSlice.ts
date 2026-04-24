// src/lib/redux/slices/jobSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  postedDate: string;
}

interface JobState {
  jobs: Job[];
  filteredJobs: Job[];
  selectedJob: Job | null;
  isLoading: boolean;
  filters: {
    location: string;
    jobType: string;
    salaryRange: string;
  };
}

const initialState: JobState = {
  jobs: [],
  filteredJobs: [],
  selectedJob: null,
  isLoading: false,
  filters: {
    location: "",
    jobType: "",
    salaryRange: "",
  },
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
      state.filteredJobs = action.payload;
    },
    setSelectedJob: (state, action: PayloadAction<Job>) => {
      state.selectedJob = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<JobState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters
      state.filteredJobs = state.jobs.filter((job) => {
        let matches = true;
        if (
          state.filters.location &&
          !job.location.includes(state.filters.location)
        ) {
          matches = false;
        }
        if (state.filters.jobType && job.type !== state.filters.jobType) {
          matches = false;
        }
        return matches;
      });
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredJobs = state.jobs;
    },
  },
});

export const { setJobs, setSelectedJob, setLoading, setFilters, clearFilters } =
  jobSlice.actions;
export default jobSlice.reducer;
