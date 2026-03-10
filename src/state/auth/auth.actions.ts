import {
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  REFRESH_TOKEN_REQUEST,
  INIT_AUTH,
  CLEAR_AUTH_ERROR,
  VERIFICATION_COMPLETE,
  UPDATE_USER_SUBSCRIPTION,
  type LoginRequestAction,
  type RegisterRequestAction,
  type LogoutRequestAction,
  type RefreshTokenRequestAction,
  type InitAuthAction,
  type ClearAuthErrorAction,
  type VerificationCompleteAction,
  type UpdateUserSubscriptionAction,
  type SubscriptionBannerState,
} from './types';

export const loginRequest = (payload: { email: string; password: string }): LoginRequestAction => ({
  type: LOGIN_REQUEST,
  payload,
});

export const registerRequest = (payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  category?: string;
}): RegisterRequestAction => ({
  type: REGISTER_REQUEST,
  payload,
});

export const logoutRequest = (): LogoutRequestAction => ({
  type: LOGOUT_REQUEST,
});

export const refreshTokenRequest = (payload: { refreshToken: string }): RefreshTokenRequestAction => ({
  type: REFRESH_TOKEN_REQUEST,
  payload,
});

export const initAuth = (): InitAuthAction => ({
  type: INIT_AUTH,
});

export const clearAuthError = (): ClearAuthErrorAction => ({
  type: CLEAR_AUTH_ERROR,
});

export const verificationComplete = (user?: unknown): VerificationCompleteAction => ({
  type: VERIFICATION_COMPLETE,
  payload: user,
});

export const updateUserSubscription = (payload: {
  isPro: boolean;
  banner: SubscriptionBannerState | null;
}): UpdateUserSubscriptionAction => ({
  type: UPDATE_USER_SUBSCRIPTION,
  payload,
});
