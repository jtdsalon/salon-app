import * as TYPES from './types'

export const settingsReducer = (
  state = TYPES.initialState,
  action: any
): TYPES.SettingsState => {
  switch (action.type) {
    case TYPES.GET_USER_SETTINGS:
      return { ...state, loading: true, error: null }

    case TYPES.GET_USER_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null,
      }

    case TYPES.GET_USER_SETTINGS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case TYPES.UPDATE_USER_SETTINGS:
      return { ...state, updating: true, error: null }

    case TYPES.UPDATE_USER_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload,
        updating: false,
        success: true,
        successMessage: 'Settings updated successfully',
      }

    case TYPES.UPDATE_USER_SETTINGS_ERROR:
      return {
        ...state,
        updating: false,
        error: action.payload,
      }

    case TYPES.UPDATE_PASSWORD:
      return { ...state, updating: true, error: null }

    case TYPES.UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        updating: false,
        success: true,
        successMessage: 'Password updated successfully',
      }

    case TYPES.UPDATE_PASSWORD_ERROR:
      return {
        ...state,
        updating: false,
        error: action.payload,
      }

    case TYPES.UPDATE_NOTIFICATIONS:
      return { ...state, updating: true, error: null }

    case TYPES.UPDATE_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        settings: action.payload,
        updating: false,
        success: true,
        successMessage: 'Notification settings updated',
      }

    case TYPES.UPDATE_NOTIFICATIONS_ERROR:
      return {
        ...state,
        updating: false,
        error: action.payload,
      }

    case TYPES.TOGGLE_TWO_FACTOR:
      return { ...state, updating: true, error: null }

    case TYPES.TOGGLE_TWO_FACTOR_SUCCESS:
      return {
        ...state,
        settings: action.payload,
        updating: false,
        success: true,
        successMessage: 'Two-factor authentication updated',
      }

    case TYPES.TOGGLE_TWO_FACTOR_ERROR:
      return {
        ...state,
        updating: false,
        error: action.payload,
      }

    case TYPES.GET_ACTIVITY_LOG:
      return { ...state, activityLoading: true, error: null }

    case TYPES.GET_ACTIVITY_LOG_SUCCESS:
      return {
        ...state,
        activityLog: action.payload,
        activityLoading: false,
        error: null,
      }

    case TYPES.GET_ACTIVITY_LOG_ERROR:
      return {
        ...state,
        activityLoading: false,
        error: action.payload,
      }

    case TYPES.GET_ALL_ACTIVITY_LOG:
      return {
        ...state,
        allActivityLoading: !action.payload.append,
        allActivityLoadingMore: !!action.payload.append,
        allActivityError: null,
      }

    case TYPES.GET_ALL_ACTIVITY_LOG_SUCCESS: {
      const { data, total, append } = action.payload
      return {
        ...state,
        allActivityLog: append ? [...state.allActivityLog, ...data] : data,
        allActivityTotal: total,
        allActivityLoading: false,
        allActivityLoadingMore: false,
        allActivityError: null,
      }
    }

    case TYPES.GET_ALL_ACTIVITY_LOG_ERROR:
      return {
        ...state,
        allActivityLoading: false,
        allActivityLoadingMore: false,
        allActivityError: action.payload,
      }

    case TYPES.CLEAR_ALL_ACTIVITY:
      return {
        ...state,
        allActivityLog: [],
        allActivityTotal: 0,
        allActivityLoading: false,
        allActivityLoadingMore: false,
        allActivityError: null,
      }

    case TYPES.DELETE_ACCOUNT:
      return { ...state, deleting: true, error: null }

    case TYPES.DELETE_ACCOUNT_SUCCESS:
      return {
        ...state,
        deleting: false,
        success: true,
        successMessage: 'Account deleted successfully',
      }

    case TYPES.DELETE_ACCOUNT_ERROR:
      return {
        ...state,
        deleting: false,
        error: action.payload,
      }

    case TYPES.CLEAR_SETTINGS_SUCCESS:
      return { ...state, success: false, successMessage: '' }

    case TYPES.CLEAR_SETTINGS_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}
