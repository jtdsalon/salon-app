import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  refreshTokenRequest,
  initAuth,
  clearAuthError,
  verificationComplete,
} from '@/state/auth/auth.actions';
import {
  selectUser,
  selectRoles,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectVerificationPending,
  selectIsVerified,
  selectSignupSuccess,
  selectRefreshToken,
  selectAuthInitialized,
} from '@/state/auth/auth.selectors';
import type { RootState } from '@/state/store';

/** Thin auth hook: dispatches actions, uses selectors. No business logic. */
export const useAuthAction = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const verificationPending = useSelector(selectVerificationPending);
  const isVerified = useSelector(selectIsVerified);
  const signupSuccess = useSelector(selectSignupSuccess);
  const isInitialized = useSelector(selectAuthInitialized);
  const refreshToken = useSelector(selectRefreshToken);

  const login = useCallback(
    (payload: { email: string; password: string }) => {
      dispatch(loginRequest(payload) as any);
    },
    [dispatch]
  );

  const register = useCallback(
    (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      category?: string;
    }) => {
      dispatch(registerRequest(payload) as any);
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutRequest() as any);
  }, [dispatch]);

  const refresh = useCallback(() => {
    const token = refreshToken ?? localStorage.getItem('refreshToken');
    if (token) {
      dispatch(refreshTokenRequest({ refreshToken: token }) as any);
    }
  }, [dispatch, refreshToken]);

  const initialize = useCallback(() => {
    dispatch(initAuth() as any);
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError() as any);
  }, [dispatch]);

  const completeVerification = useCallback((user?: unknown) => {
    dispatch(verificationComplete(user) as any);
  }, [dispatch]);

  return {
    user,
    roles,
    loading,
    error,
    isAuthenticated,
    verificationPending,
    isVerified,
    signupSuccess,
    isInitialized,
    login,
    register,
    logout,
    refresh,
    initialize,
    clearError,
    completeVerification,
  };
};
