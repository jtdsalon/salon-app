// filepath: salon-app/src/state/auth/index.ts
export { default as AuthProvider } from './AuthProvider';
export { AuthContext } from './AuthContextDef';
export type { AuthContextType, User } from './AuthContextDef';
export { useAuthContext } from './useAuthContext';
export {
  loginRequest,
  registerRequest,
  logoutRequest,
  refreshTokenRequest,
  initAuth,
  clearAuthError,
  verificationComplete,
} from './auth.actions';
export {
  selectUser,
  selectRoles,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectVerificationPending,
  selectIsVerified,
  selectSignupSuccess,
  selectAuthInitialized,
} from './auth.selectors';
export type { AuthState, AuthUser, AuthAction, SalonRole } from './types';
