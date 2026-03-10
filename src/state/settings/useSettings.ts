import { useDispatch, useSelector } from 'react-redux'
import * as TYPES from './types'
import { RootState } from '../store'

export const useSettings = () => {
  const dispatch = useDispatch()
  const settings = useSelector((state: RootState) => state.settings)

  return {
    settings: settings.settings,
    activityLog: settings.activityLog,
    activityLoading: settings.activityLoading,
    allActivityLog: settings.allActivityLog,
    allActivityTotal: settings.allActivityTotal,
    allActivityLoading: settings.allActivityLoading,
    allActivityLoadingMore: settings.allActivityLoadingMore,
    allActivityError: settings.allActivityError,
    loading: settings.loading,
    updating: settings.updating,
    deleting: settings.deleting,
    error: settings.error,
    success: settings.success,
    successMessage: settings.successMessage,

    // Actions
    getUserSettings: (userId: string) =>
      dispatch({ type: TYPES.GET_USER_SETTINGS, payload: userId }),
    updateUserSettings: (userId: string, data: Partial<TYPES.UserSettings>) =>
      dispatch({ type: TYPES.UPDATE_USER_SETTINGS, payload: { userId, data } }),
    updatePassword: (userId: string, data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
      dispatch({ type: TYPES.UPDATE_PASSWORD, payload: { userId, data } }),
    updateNotifications: (userId: string, data: any) =>
      dispatch({ type: TYPES.UPDATE_NOTIFICATIONS, payload: { userId, data } }),
    toggleTwoFactor: (userId: string, enabled: boolean) =>
      dispatch({ type: TYPES.TOGGLE_TWO_FACTOR, payload: { userId, enabled } }),
    getActivityLog: (userId: string, limit = 10, offset = 0) =>
      dispatch({ type: TYPES.GET_ACTIVITY_LOG, payload: { userId, limit, offset } }),
    getAllActivityLog: (userId: string, limit: number, offset: number, append = false) =>
      dispatch({ type: TYPES.GET_ALL_ACTIVITY_LOG, payload: { userId, limit, offset, append } }),
    clearAllActivity: () => dispatch({ type: TYPES.CLEAR_ALL_ACTIVITY }),
    deleteAccount: (userId: string, password: string) =>
      dispatch({ type: TYPES.DELETE_ACCOUNT, payload: { userId, password } }),
    clearSuccess: () => dispatch({ type: TYPES.CLEAR_SETTINGS_SUCCESS }),
    clearError: () => dispatch({ type: TYPES.CLEAR_SETTINGS_ERROR }),
  }
}
