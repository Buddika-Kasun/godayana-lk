// src/lib/redux/middleware/tokenMiddleware.ts
import { Middleware } from "@reduxjs/toolkit";
import { refreshAccessToken, logoutUser } from "../actions/authActions";
import { setError } from "../slices/authSlice";

let refreshPromise: Promise<any> | null = null;

export const tokenMiddleware: Middleware =
  (store) => (next) => async (action) => {
    // Check if action is from API and has 401 error
    if (
      action.type?.endsWith("/rejected") &&
      action.error?.message?.includes("401")
    ) {
      const state = store.getState();
      const { isRefreshing, refreshToken } = state.auth;

      if (!refreshToken) {
        store.dispatch(logoutUser());
        return next(action);
      }

      if (!isRefreshing && !refreshPromise) {
        refreshPromise = store.dispatch(refreshAccessToken()).unwrap();

        try {
          await refreshPromise;
          refreshPromise = null;
          // Retry the original action
          return store.dispatch(action.meta.arg);
        } catch (error) {
          refreshPromise = null;
          store.dispatch(logoutUser());
          store.dispatch(setError("Session expired. Please login again."));
          return next(action);
        }
      } else if (refreshPromise) {
        // Wait for refresh to complete
        await refreshPromise;
        // Retry the original action
        return store.dispatch(action.meta.arg);
      }
    }

    return next(action);
  };
