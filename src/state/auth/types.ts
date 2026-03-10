// Auth state & action type definitions (following user-app pattern)

/** Role for a specific salon - used for RBAC */
export interface SalonRole {
  salonId: string;
  role: string;
  permissions?: string[];
}

/** Page (salon page) for feed - from backend ensureSalonPages */
export interface SalonPage {
  salonId: string;
  pageId: string;
  pageName: string;
}

/** Subscription banner from backend (trial_ending, payment_due, expired) */
export interface SubscriptionBannerState {
  type: 'trial_ending' | 'payment_due' | 'expired';
  daysLeft?: number;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  salonId?: string;
  roles?: SalonRole[];
  /** From backend: user.is_verified or user.email_verified. Navigation depends on this. */
  is_verified?: boolean;
  email_verified?: boolean;
  /** From backend: subscription summary for PRO badge and banner */
  subscription?: {
    isPro: boolean;
    banner: SubscriptionBannerState | null;
  };
  /** Salon pages for feed identity - owner posts as Page, not personal account */
  pages?: SalonPage[];
}

export interface AuthState {
  user: AuthUser | null;
  roles: SalonRole[];
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  /** From backend: user.is_verified. Controls navigation to /verification vs /dashboard. */
  isVerified: boolean;
  /** True when signup succeeded but verification not yet completed. Blocks dashboard. */
  verificationPending: boolean;
  isInitialized: boolean;
  /** Set on signup success; cleared on failure or when navigating away. */
  signupSuccess: boolean;
}

export const INITIAL_STATE: AuthState = {
  user: null,
  roles: [],
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isVerified: false,
  verificationPending: false,
  isInitialized: false,
  signupSuccess: false,
};

// Action type constants
export const LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'AUTH/LOGIN_FAILURE';

export const REGISTER_REQUEST = 'AUTH/REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'AUTH/REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'AUTH/REGISTER_FAILURE';

export const LOGOUT_REQUEST = 'AUTH/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'AUTH/LOGOUT_SUCCESS';

export const REFRESH_TOKEN_REQUEST = 'AUTH/REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_SUCCESS = 'AUTH/REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAILURE = 'AUTH/REFRESH_TOKEN_FAILURE';

export const INIT_AUTH = 'AUTH/INIT_AUTH';
export const INIT_AUTH_SUCCESS = 'AUTH/INIT_AUTH_SUCCESS';

export const CLEAR_AUTH_ERROR = 'AUTH/CLEAR_AUTH_ERROR';

export const VERIFICATION_COMPLETE = 'AUTH/VERIFICATION_COMPLETE';
export const UPDATE_USER_SUBSCRIPTION = 'AUTH/UPDATE_USER_SUBSCRIPTION';

// Action interfaces
export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  payload: { email: string; password: string };
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: { user: AuthUser; roles: SalonRole[]; token: string; refreshToken: string };
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

export interface RegisterRequestAction {
  type: typeof REGISTER_REQUEST;
  payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    category?: string;
  };
}

export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: { user: AuthUser; roles: SalonRole[]; token: string; refreshToken: string };
}

export interface RegisterFailureAction {
  type: typeof REGISTER_FAILURE;
  payload: string;
}

export interface LogoutRequestAction {
  type: typeof LOGOUT_REQUEST;
}

export interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export interface RefreshTokenRequestAction {
  type: typeof REFRESH_TOKEN_REQUEST;
  payload: { refreshToken: string };
}

export interface RefreshTokenSuccessAction {
  type: typeof REFRESH_TOKEN_SUCCESS;
  payload: { token: string; refreshToken: string };
}

export interface RefreshTokenFailureAction {
  type: typeof REFRESH_TOKEN_FAILURE;
  payload: string;
}

export interface InitAuthAction {
  type: typeof INIT_AUTH;
}

export interface InitAuthSuccessAction {
  type: typeof INIT_AUTH_SUCCESS;
  payload: { user: AuthUser; roles: SalonRole[]; token: string; refreshToken: string } | null;
}

export interface ClearAuthErrorAction {
  type: typeof CLEAR_AUTH_ERROR;
}

export interface VerificationCompleteAction {
  type: typeof VERIFICATION_COMPLETE;
  payload?: AuthUser | unknown;
}

export interface UpdateUserSubscriptionAction {
  type: typeof UPDATE_USER_SUBSCRIPTION;
  payload: { isPro: boolean; banner: SubscriptionBannerState | null };
}

export type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction
  | LogoutRequestAction
  | LogoutSuccessAction
  | RefreshTokenRequestAction
  | RefreshTokenSuccessAction
  | RefreshTokenFailureAction
  | InitAuthAction
  | InitAuthSuccessAction
  | ClearAuthErrorAction
  | VerificationCompleteAction
  | UpdateUserSubscriptionAction;
