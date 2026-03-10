import type { RootState } from '../store';

const selectAuthState = (state: RootState) => state.auth;

export const selectUser = (state: RootState) => selectAuthState(state).user;

export const selectToken = (state: RootState) => selectAuthState(state).token;

export const selectRefreshToken = (state: RootState) => selectAuthState(state).refreshToken;

export const selectAuthLoading = (state: RootState) => selectAuthState(state).loading;

export const selectAuthError = (state: RootState) => selectAuthState(state).error;

export const selectIsAuthenticated = (state: RootState) => selectAuthState(state).isAuthenticated;

export const selectVerificationPending = (state: RootState) => selectAuthState(state).verificationPending;

export const selectIsVerified = (state: RootState) => selectAuthState(state).isVerified;

export const selectSignupSuccess = (state: RootState) => selectAuthState(state).signupSuccess;

export const selectAuthInitialized = (state: RootState) => selectAuthState(state).isInitialized;

export const selectRoles = (state: RootState) => selectAuthState(state).roles;
