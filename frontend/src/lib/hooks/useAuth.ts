// src/lib/hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from "../redux/store";
import { loginUser, logoutUser } from "../redux/actions/authActions";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );

  const login = async (identifier: string, password: string) => {
    try {
      await dispatch(loginUser({ identifier, password })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
