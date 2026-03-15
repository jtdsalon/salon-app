// Branch Action Types
export const GET_BRANCHES = 'GET_BRANCHES' as const
export const GET_BRANCHES_SUCCESS = 'GET_BRANCHES_SUCCESS' as const
export const GET_BRANCHES_ERROR = 'GET_BRANCHES_ERROR' as const

export const GET_BRANCH_BY_ID = 'GET_BRANCH_BY_ID' as const
export const GET_BRANCH_BY_ID_SUCCESS = 'GET_BRANCH_BY_ID_SUCCESS' as const
export const GET_BRANCH_BY_ID_ERROR = 'GET_BRANCH_BY_ID_ERROR' as const

export const CREATE_BRANCH = 'CREATE_BRANCH' as const
export const CREATE_BRANCH_SUCCESS = 'CREATE_BRANCH_SUCCESS' as const
export const CREATE_BRANCH_ERROR = 'CREATE_BRANCH_ERROR' as const

export const UPDATE_BRANCH = 'UPDATE_BRANCH' as const
export const UPDATE_BRANCH_SUCCESS = 'UPDATE_BRANCH_SUCCESS' as const
export const UPDATE_BRANCH_ERROR = 'UPDATE_BRANCH_ERROR' as const

export const DELETE_BRANCH = 'DELETE_BRANCH' as const
export const DELETE_BRANCH_SUCCESS = 'DELETE_BRANCH_SUCCESS' as const
export const DELETE_BRANCH_ERROR = 'DELETE_BRANCH_ERROR' as const

export const CLEAR_SUCCESS = 'CLEAR_SUCCESS' as const
export const CLEAR_ERROR = 'CLEAR_ERROR' as const

export interface OperatingHours {
  day: string
  openTime: string
  closeTime: string
  isClosed: boolean
}

export interface Branch {
  id: string
  name: string
  salonId: string
  address: string
  city: string
  state: string
  zipCode: string
  phone?: string
  email?: string
  latitude?: number
  longitude?: number
  operatingHours?: OperatingHours[]
  managerId?: string
  staffCount?: number
  status?: 'active' | 'inactive' | 'opening-soon'
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export interface BranchState {
  branchList: Branch[]
  currentBranch: Branch | null
  loading: boolean
  itemLoading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  error: any
  success: boolean
  successMessage: string
}

export const INITIAL_STATE: BranchState = {
  branchList: [],
  currentBranch: null,
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
export type BranchAction =
  | { type: typeof GET_BRANCHES; payload: string }
  | { type: typeof GET_BRANCHES_SUCCESS; payload: Branch[] }
  | { type: typeof GET_BRANCHES_ERROR; payload: any }
  | { type: typeof GET_BRANCH_BY_ID; payload: string }
  | { type: typeof GET_BRANCH_BY_ID_SUCCESS; payload: Branch }
  | { type: typeof GET_BRANCH_BY_ID_ERROR; payload: any }
  | { type: typeof CREATE_BRANCH; payload: Partial<Branch> }
  | { type: typeof CREATE_BRANCH_SUCCESS; payload: Branch }
  | { type: typeof CREATE_BRANCH_ERROR; payload: any }
  | { type: typeof UPDATE_BRANCH; payload: { id: string; data: Partial<Branch> } }
  | { type: typeof UPDATE_BRANCH_SUCCESS; payload: Branch }
  | { type: typeof UPDATE_BRANCH_ERROR; payload: any }
  | { type: typeof DELETE_BRANCH; payload: string }
  | { type: typeof DELETE_BRANCH_SUCCESS; payload: string }
  | { type: typeof DELETE_BRANCH_ERROR; payload: any }
  | { type: typeof CLEAR_SUCCESS }
  | { type: typeof CLEAR_ERROR }
