import { call, put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import authService from '@/services/api/authService';
import { select } from 'redux-saga/effects';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
  INIT_AUTH,
  INIT_AUTH_SUCCESS,
  VERIFICATION_COMPLETE,
  type LoginRequestAction,
  type RegisterRequestAction,
  type RefreshTokenRequestAction,
} from './types';
import { selectToken, selectRefreshToken, selectUser } from './auth.selectors';

function* handleLogin(action: LoginRequestAction): SagaIterator {
  try {
    const response = yield call([authService, authService.login], action.payload);
    const data = response?.data ?? response;
    const token = data?.data?.token ?? data?.token ?? '';
    const refreshToken = data?.data?.refreshToken ?? data?.refreshToken ?? '';
    const user = data?.data?.user ?? data?.user ?? null;
    const roles = user?.roles ?? data?.data?.user?.roles ?? data?.user?.roles ?? [];
    if (token && user) {
      yield put({
        type: LOGIN_SUCCESS,
        payload: { user, roles, token, refreshToken },
      });
    } else {
      yield put({ type: LOGIN_FAILURE, payload: 'Invalid login response' });
    }
  } catch (error: any) {
    const msg =
      error?.errorMessage ??
      error?.response?.data?.message ??
      error?.message ??
      'Invalid credentials. Please try again.';
    yield put({ type: LOGIN_FAILURE, payload: msg });
  }
}

function* handleRegister(action: RegisterRequestAction): SagaIterator {
  try {
    const payload = action.payload;
    const response = yield call([authService, authService.register], {
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      category: payload.category,
    });
    const data = response?.data ?? response;

    // Only navigate to verification when backend confirms success. Do not rely on try/catch alone.
    // Handle success: false or error codes (CONFLICT, BAD_REQUEST, etc.) without redirecting.
    if (data?.success === false || data?.code) {
      const msg = data?.message ?? 'Registration failed';
      yield put({ type: REGISTER_FAILURE, payload: msg });
      return;
    }

    const token = data?.data?.token ?? data?.token ?? '';
    const refreshToken = data?.data?.refreshToken ?? data?.refreshToken ?? '';
    const user = data?.data?.user ?? data?.user ?? null;
    const roles = user?.roles ?? data?.data?.user?.roles ?? data?.user?.roles ?? [];

    if (token && user) {
      yield put({
        type: REGISTER_SUCCESS,
        payload: { user, roles, token, refreshToken },
      });
    } else {
      const msg = data?.message ?? 'Invalid register response';
      yield put({ type: REGISTER_FAILURE, payload: msg });
    }
  } catch (error: any) {
    const msg =
      error?.errorMessage ??
      error?.response?.data?.message ??
      error?.message ??
      'Registration failed';
    yield put({ type: REGISTER_FAILURE, payload: msg });
  }
}

function* handleLogout(): SagaIterator {
  try {
    yield call([authService, authService.logout]);
  } catch {
    // Continue logout even if API fails
  } finally {
    yield put({ type: LOGOUT_SUCCESS });
  }
}

function* handleRefreshToken(action: RefreshTokenRequestAction): SagaIterator {
  try {
    const response = yield call([authService, authService.refreshToken], action.payload.refreshToken);
    const data = response?.data ?? response;
    const token = data?.token ?? '';
    const refreshToken = data?.refreshToken ?? action.payload.refreshToken;
    if (token) {
      yield put({ type: REFRESH_TOKEN_SUCCESS, payload: { token, refreshToken } });
    } else {
      yield put({ type: REFRESH_TOKEN_FAILURE, payload: 'Invalid refresh response' });
    }
  } catch (error: any) {
    const msg = error?.errorMessage ?? error?.message ?? 'Token refresh failed';
    yield put({ type: REFRESH_TOKEN_FAILURE, payload: msg });
  }
}

function* handleInitAuth(): SagaIterator {
  try {
    const token = authService.getStoredToken();
    const user = authService.getStoredUser();
    const refreshToken = localStorage.getItem('refreshToken');
    const roles = user?.roles ?? [];
    if (token && user) {
      yield put({
        type: INIT_AUTH_SUCCESS,
        payload: {
          user,
          roles,
          token,
          refreshToken: refreshToken ?? '',
        },
      });
    } else {
      yield put({ type: INIT_AUTH_SUCCESS, payload: null });
    }
  } catch {
    yield put({ type: INIT_AUTH_SUCCESS, payload: null });
  }
}

function* handleVerificationComplete(action: { payload?: unknown }): SagaIterator {
  const token = yield select(selectToken);
  const refreshToken = yield select(selectRefreshToken);
  const user = action?.payload ?? (yield select(selectUser));
  if (token) localStorage.setItem('token', token);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  if (user) localStorage.setItem('user', JSON.stringify(user));
}

export default function* authSaga(): SagaIterator {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(REGISTER_REQUEST, handleRegister);
  yield takeLatest(LOGOUT_REQUEST, handleLogout);
  yield takeLatest(REFRESH_TOKEN_REQUEST, handleRefreshToken);
  yield takeLatest(INIT_AUTH, handleInitAuth);
  yield takeLatest(VERIFICATION_COMPLETE, handleVerificationComplete);
}
