import { call, fork, put, takeEvery } from 'redux-saga/effects'
import * as TYPES from './types'
import * as settingsApi from '../../services/api/settingsService'
import logger from '../../lib/logger'

function* getUserSettingsSaga(action: any): any {
  try {
    const response = yield call(settingsApi.getUserSettingsApi, action.payload)
    if (response.data?.data) {
      yield put({ type: TYPES.GET_USER_SETTINGS_SUCCESS, payload: response.data.data })
    } else {
      yield put({ type: TYPES.GET_USER_SETTINGS_ERROR, payload: 'Failed to fetch settings' })
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch settings'
    logger.error('Get user settings error:', err)
    yield put({ type: TYPES.GET_USER_SETTINGS_ERROR, payload: errorMessage })
  }
}

function* updateUserSettingsSaga(action: any): any {
  try {
    const { userId, data } = action.payload
    const response = yield call(settingsApi.updateUserSettingsApi, userId, data)
    if (response.data?.data) {
      yield put({ type: TYPES.UPDATE_USER_SETTINGS_SUCCESS, payload: response.data.data })
    } else {
      yield put({ type: TYPES.UPDATE_USER_SETTINGS_ERROR, payload: 'Failed to update settings' })
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to update settings'
    logger.error('Update user settings error:', err)
    yield put({ type: TYPES.UPDATE_USER_SETTINGS_ERROR, payload: errorMessage })
  }
}

function* updatePasswordSaga(action: any): any {
  try {
    const { userId, data } = action.payload
    yield call(settingsApi.updatePasswordApi, userId, data)
    yield put({ type: TYPES.UPDATE_PASSWORD_SUCCESS })
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to update password'
    logger.error('Update password error:', err)
    yield put({ type: TYPES.UPDATE_PASSWORD_ERROR, payload: errorMessage })
  }
}

function* updateNotificationsSaga(action: any): any {
  try {
    const { userId, data } = action.payload
    const response = yield call(settingsApi.updateNotificationsApi, userId, data)
    if (response.data?.data) {
      yield put({ type: TYPES.UPDATE_NOTIFICATIONS_SUCCESS, payload: response.data.data })
    } else {
      yield put({ type: TYPES.UPDATE_NOTIFICATIONS_ERROR, payload: 'Failed to update notifications' })
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to update notifications'
    logger.error('Update notifications error:', err)
    yield put({ type: TYPES.UPDATE_NOTIFICATIONS_ERROR, payload: errorMessage })
  }
}

function* toggleTwoFactorSaga(action: any): any {
  try {
    const { userId, enabled } = action.payload
    const response = yield call(settingsApi.toggleTwoFactorApi, userId, enabled)
    if (response.data?.data) {
      yield put({ type: TYPES.TOGGLE_TWO_FACTOR_SUCCESS, payload: response.data.data })
    } else {
      yield put({ type: TYPES.TOGGLE_TWO_FACTOR_ERROR, payload: 'Failed to toggle two-factor' })
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to toggle two-factor'
    logger.error('Toggle two-factor error:', err)
    yield put({ type: TYPES.TOGGLE_TWO_FACTOR_ERROR, payload: errorMessage })
  }
}

function* getActivityLogSaga(action: any): any {
  try {
    const { userId, limit, offset } = action.payload
    const response = yield call(settingsApi.getActivityLogApi, userId, limit, offset)
    if (response.data?.data) {
      yield put({ type: TYPES.GET_ACTIVITY_LOG_SUCCESS, payload: response.data.data })
    } else {
      yield put({ type: TYPES.GET_ACTIVITY_LOG_ERROR, payload: 'Failed to fetch activity log' })
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch activity log'
    logger.error('Get activity log error:', err)
    yield put({ type: TYPES.GET_ACTIVITY_LOG_ERROR, payload: errorMessage })
  }
}

function* getAllActivityLogSaga(action: any): any {
  try {
    const { userId, limit, offset, append } = action.payload
    const response = yield call(settingsApi.getActivityLogApi, userId, limit, offset)
    if (response.data?.data) {
      const total = response.data?.total ?? response.data.data.length
      yield put({
        type: TYPES.GET_ALL_ACTIVITY_LOG_SUCCESS,
        payload: { data: response.data.data, total, append: !!append },
      })
    } else {
      yield put({ type: TYPES.GET_ALL_ACTIVITY_LOG_ERROR, payload: 'Failed to fetch activity log' })
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch activity log'
    logger.error('Get all activity log error:', err)
    yield put({ type: TYPES.GET_ALL_ACTIVITY_LOG_ERROR, payload: errorMessage })
  }
}

function* deleteAccountSaga(action: any): any {
  try {
    const { userId, password } = action.payload
    yield call(settingsApi.deleteAccountApi, userId, password)
    yield put({ type: TYPES.DELETE_ACCOUNT_SUCCESS })
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to delete account'
    logger.error('Delete account error:', err)
    yield put({ type: TYPES.DELETE_ACCOUNT_ERROR, payload: errorMessage })
  }
}

export function* settingsSaga(): any {
  yield takeEvery(TYPES.GET_USER_SETTINGS, getUserSettingsSaga)
  yield takeEvery(TYPES.UPDATE_USER_SETTINGS, updateUserSettingsSaga)
  yield takeEvery(TYPES.UPDATE_PASSWORD, updatePasswordSaga)
  yield takeEvery(TYPES.UPDATE_NOTIFICATIONS, updateNotificationsSaga)
  yield takeEvery(TYPES.TOGGLE_TWO_FACTOR, toggleTwoFactorSaga)
  yield takeEvery(TYPES.GET_ACTIVITY_LOG, getActivityLogSaga)
  yield takeEvery(TYPES.GET_ALL_ACTIVITY_LOG, getAllActivityLogSaga)
  yield takeEvery(TYPES.DELETE_ACCOUNT, deleteAccountSaga)
}
