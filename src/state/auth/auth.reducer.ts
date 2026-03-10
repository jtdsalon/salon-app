import * as TYPES from './types';
import type { AuthState, AuthAction, SalonRole } from './types';

export const authReducer = (state: AuthState = TYPES.INITIAL_STATE, action: AuthAction): AuthState => {
  switch (action.type) {
    case TYPES.LOGIN_REQUEST:
    case TYPES.REGISTER_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.LOGIN_SUCCESS: {
      const payload = action.payload;
      const roles: SalonRole[] = payload.roles ?? payload.user?.roles ?? [];
      const isVerified = payload.user?.is_verified ?? payload.user?.email_verified ?? false;
      return {
        ...state,
        loading: false,
        user: payload.user,
        roles,
        token: payload.token,
        refreshToken: payload.refreshToken,
        error: null,
        isAuthenticated: true,
        isVerified,
        verificationPending: !isVerified,
        signupSuccess: false,
      };
    }
    case TYPES.REGISTER_SUCCESS: {
      const payload = action.payload;
      const roles: SalonRole[] = payload.roles ?? payload.user?.roles ?? [];
      const isVerified = payload.user?.is_verified ?? payload.user?.email_verified ?? false;
      return {
        ...state,
        loading: false,
        user: payload.user,
        roles,
        token: payload.token,
        refreshToken: payload.refreshToken,
        error: null,
        isAuthenticated: true,
        isVerified,
        verificationPending: !isVerified,
        signupSuccess: true,
      };
    }

    case TYPES.LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload, isAuthenticated: false, signupSuccess: false };
    case TYPES.REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload, isAuthenticated: false, verificationPending: false, signupSuccess: false };

    case TYPES.LOGOUT_REQUEST:
      return { ...state, loading: true };

    case TYPES.LOGOUT_SUCCESS:
      return { ...TYPES.INITIAL_STATE, isInitialized: state.isInitialized };


    case TYPES.REFRESH_TOKEN_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null,
      };

    case TYPES.REFRESH_TOKEN_FAILURE:
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };

    case TYPES.INIT_AUTH:
      return state;

    case TYPES.INIT_AUTH_SUCCESS: {
      const payload = action.payload;
      if (!payload) {
        return { ...TYPES.INITIAL_STATE, isInitialized: true };
      }
      const initRoles: SalonRole[] = payload.roles ?? payload.user?.roles ?? [];
      const isVerified = payload.user?.is_verified ?? payload.user?.email_verified ?? false;
      return {
        ...state,
        user: payload.user,
        roles: initRoles,
        token: payload.token,
        refreshToken: payload.refreshToken,
        isAuthenticated: true,
        isVerified,
        verificationPending: !isVerified,
        isInitialized: true,
      };
    }

    case TYPES.CLEAR_AUTH_ERROR:
      return { ...state, error: null };

    case TYPES.VERIFICATION_COMPLETE:
      return {
        ...state,
        isAuthenticated: true,
        isVerified: true,
        verificationPending: false,
        user: (action.payload as AuthUser) ?? state.user,
      };

    case TYPES.UPDATE_USER_SUBSCRIPTION: {
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          subscription: action.payload,
        },
      };
    }

    default:
      return state;
  }
};
