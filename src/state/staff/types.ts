// Staff Action Types
export const GET_STAFF = 'GET_STAFF'
export const GET_STAFF_SUCCESS = 'GET_STAFF_SUCCESS'
export const GET_STAFF_ERROR = 'GET_STAFF_ERROR'

export const GET_STAFF_BY_ID = 'GET_STAFF_BY_ID'
export const GET_STAFF_BY_ID_SUCCESS = 'GET_STAFF_BY_ID_SUCCESS'
export const GET_STAFF_BY_ID_ERROR = 'GET_STAFF_BY_ID_ERROR'

export const CREATE_STAFF = 'CREATE_STAFF'
export const CREATE_STAFF_SUCCESS = 'CREATE_STAFF_SUCCESS'
export const CREATE_STAFF_ERROR = 'CREATE_STAFF_ERROR'

export const UPDATE_STAFF = 'UPDATE_STAFF'
export const UPDATE_STAFF_SUCCESS = 'UPDATE_STAFF_SUCCESS'
export const UPDATE_STAFF_ERROR = 'UPDATE_STAFF_ERROR'

export const DELETE_STAFF = 'DELETE_STAFF'
export const DELETE_STAFF_SUCCESS = 'DELETE_STAFF_SUCCESS'
export const DELETE_STAFF_ERROR = 'DELETE_STAFF_ERROR'

export const CLEAR_SUCCESS = 'CLEAR_SUCCESS'
export const CLEAR_ERROR = 'CLEAR_ERROR'

export interface StaffSocials {
  instagram?: string
  tiktok?: string
  facebook?: string
  linkedin?: string
}

export interface Staff {
  id: string
  name: string
  role: string
  email?: string
  phone?: string
  bio?: string
  specialties?: string[]
  socials?: StaffSocials
  experience?: number
  joinedDate?: string
  commissionRate?: number
  avatar?: string
  status?: 'active' | 'inactive' | 'on-leave' | 'blocked'
  rating?: number
  monthlyRevenue?: number
  schedule?: any[]
  [key: string]: any
}

export interface StaffState {
  staffList: Staff[]
  currentStaff: Staff | null
  loading: boolean
  itemLoading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  error: any
  success: boolean
  successMessage: string
}

export const INITIAL_STATE: StaffState = {
  staffList: [],
  currentStaff: null,
  loading: false,
  itemLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: false,
  successMessage: '',
}

// Action types
export type StaffAction =
  | { type: typeof GET_STAFF; payload: string }
  | { type: typeof GET_STAFF_SUCCESS; payload: Staff[] }
  | { type: typeof GET_STAFF_ERROR; payload: any }
  | { type: typeof GET_STAFF_BY_ID; payload: string }
  | { type: typeof GET_STAFF_BY_ID_SUCCESS; payload: Staff }
  | { type: typeof GET_STAFF_BY_ID_ERROR; payload: any }
  | { type: typeof CREATE_STAFF; payload: Partial<Staff> }
  | { type: typeof CREATE_STAFF_SUCCESS; payload: Staff }
  | { type: typeof CREATE_STAFF_ERROR; payload: any }
  | { type: typeof UPDATE_STAFF; payload: { id: string; data: Partial<Staff> } }
  | { type: typeof UPDATE_STAFF_SUCCESS; payload: Staff }
  | { type: typeof UPDATE_STAFF_ERROR; payload: any }
  | { type: typeof DELETE_STAFF; payload: string }
  | { type: typeof DELETE_STAFF_SUCCESS; payload: string }
  | { type: typeof DELETE_STAFF_ERROR; payload: any }
  | { type: typeof CLEAR_SUCCESS }
  | { type: typeof CLEAR_ERROR }
