// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import savedJobsReducer from "./slices/savedJobsSlice";
import appliedJobsReducer from "./slices/appliedJobsSlice";
import savedCoursesReducer from "./slices/savedCoursesSlice";
import appliedCoursesReducer from "./slices/appliedCoursesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    savedJobs: savedJobsReducer,
    appliedJobs: appliedJobsReducer,
    savedCourses: savedCoursesReducer,
    appliedCourses: appliedCoursesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: Disable for Next.js
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
