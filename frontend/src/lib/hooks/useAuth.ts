// src/lib/hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchCurrentUser, loginUser, logoutUser } from "../redux/actions/authActions";
import toast from "react-hot-toast";
import { updateProfileComplete } from "../redux/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isProfileComplete, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );

  const login = async (identifier: string, password: string) => {
      await dispatch(loginUser({ username: identifier, password })).unwrap();
  };

  const refreshProfileStatus = async () => {
    try {
      const response = await dispatch(fetchCurrentUser()).unwrap();
      if (response) {
        dispatch(updateProfileComplete(response.isProfileComplete || false));
      }
    } catch (error) {
      console.error("Failed to refresh profile status:", error);
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
  };

  return {
    user,
    isAuthenticated,
    isProfileComplete,
    isLoading,
    error,
    login,
    logout,
    refreshProfileStatus,
  };
}
