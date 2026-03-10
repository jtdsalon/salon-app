export interface UserSettings {
  id: string
  userId: string
  name?: string
  email?: string
  phone?: string
  bio?: string
  avatar?: string
  twoFactor: boolean
  notifications: {
    email: boolean
    sms: boolean
    system: boolean
    marketing: boolean
    newBookings: boolean
    dailyReports: boolean
    systemUpdates: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  id: string
  action: string
  targetType: string
  targetId: string
  changes: any
  createdAt: string
}

// Action Types
export const GET_USER_SETTINGS = 'GET_USER_SETTINGS'
export const GET_USER_SETTINGS_SUCCESS = 'GET_USER_SETTINGS_SUCCESS'
export const GET_USER_SETTINGS_ERROR = 'GET_USER_SETTINGS_ERROR'

export const UPDATE_USER_SETTINGS = 'UPDATE_USER_SETTINGS'
export const UPDATE_USER_SETTINGS_SUCCESS = 'UPDATE_USER_SETTINGS_SUCCESS'
export const UPDATE_USER_SETTINGS_ERROR = 'UPDATE_USER_SETTINGS_ERROR'

export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS'
export const UPDATE_PASSWORD_ERROR = 'UPDATE_PASSWORD_ERROR'

export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS'
export const UPDATE_NOTIFICATIONS_SUCCESS = 'UPDATE_NOTIFICATIONS_SUCCESS'
export const UPDATE_NOTIFICATIONS_ERROR = 'UPDATE_NOTIFICATIONS_ERROR'

export const TOGGLE_TWO_FACTOR = 'TOGGLE_TWO_FACTOR'
export const TOGGLE_TWO_FACTOR_SUCCESS = 'TOGGLE_TWO_FACTOR_SUCCESS'
export const TOGGLE_TWO_FACTOR_ERROR = 'TOGGLE_TWO_FACTOR_ERROR'

export const GET_ACTIVITY_LOG = 'GET_ACTIVITY_LOG'
export const GET_ACTIVITY_LOG_SUCCESS = 'GET_ACTIVITY_LOG_SUCCESS'
export const GET_ACTIVITY_LOG_ERROR = 'GET_ACTIVITY_LOG_ERROR'

export const GET_ALL_ACTIVITY_LOG = 'GET_ALL_ACTIVITY_LOG'
export const GET_ALL_ACTIVITY_LOG_SUCCESS = 'GET_ALL_ACTIVITY_LOG_SUCCESS'
export const GET_ALL_ACTIVITY_LOG_ERROR = 'GET_ALL_ACTIVITY_LOG_ERROR'
export const CLEAR_ALL_ACTIVITY = 'CLEAR_ALL_ACTIVITY'

export const DELETE_ACCOUNT = 'DELETE_ACCOUNT'
export const DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS'
export const DELETE_ACCOUNT_ERROR = 'DELETE_ACCOUNT_ERROR'

export const CLEAR_SETTINGS_SUCCESS = 'CLEAR_SETTINGS_SUCCESS'
export const CLEAR_SETTINGS_ERROR = 'CLEAR_SETTINGS_ERROR'

// Initial State
export interface SettingsState {
  settings: UserSettings | null
  activityLog: ActivityLog[]
  activityLoading: boolean
  allActivityLog: ActivityLog[]
  allActivityTotal: number
  allActivityLoading: boolean
  allActivityLoadingMore: boolean
  allActivityError: string | null
  loading: boolean
  updating: boolean
  deleting: boolean
  error: string | null
  success: boolean
  successMessage: string
}

export const initialState: SettingsState = {
  settings: null,
  activityLog: [],
  activityLoading: false,
  allActivityLog: [],
  allActivityTotal: 0,
  allActivityLoading: false,
  allActivityLoadingMore: false,
  allActivityError: null,
  loading: false,
  updating: false,
  deleting: false,
  error: null,
  success: false,
  successMessage: '',
}
