// Service Action Types
export const GET_SERVICES = 'GET_SERVICES' as const
export const GET_SERVICES_SUCCESS = 'GET_SERVICES_SUCCESS' as const
export const GET_SERVICES_ERROR = 'GET_SERVICES_ERROR' as const

export const GET_SERVICE_BY_ID = 'GET_SERVICE_BY_ID' as const
export const GET_SERVICE_BY_ID_SUCCESS = 'GET_SERVICE_BY_ID_SUCCESS' as const
export const GET_SERVICE_BY_ID_ERROR = 'GET_SERVICE_BY_ID_ERROR' as const

export const CREATE_SERVICE = 'CREATE_SERVICE' as const
export const CREATE_SERVICE_SUCCESS = 'CREATE_SERVICE_SUCCESS' as const
export const CREATE_SERVICE_ERROR = 'CREATE_SERVICE_ERROR' as const

export const UPDATE_SERVICE = 'UPDATE_SERVICE' as const
export const UPDATE_SERVICE_SUCCESS = 'UPDATE_SERVICE_SUCCESS' as const
export const UPDATE_SERVICE_ERROR = 'UPDATE_SERVICE_ERROR' as const

export const DELETE_SERVICE = 'DELETE_SERVICE' as const
export const DELETE_SERVICE_SUCCESS = 'DELETE_SERVICE_SUCCESS' as const
export const DELETE_SERVICE_ERROR = 'DELETE_SERVICE_ERROR' as const

export const CLEAR_SUCCESS = 'CLEAR_SUCCESS' as const
export const CLEAR_ERROR = 'CLEAR_ERROR' as const

export interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_minutes: number
  description?: string
  is_active?: boolean
  [key: string]: any
}

export interface ServiceState {
  serviceList: Service[]
  currentService: Service | null
  loading: boolean
  itemLoading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  error: any
  success: boolean
  successMessage: string
}

export const INITIAL_STATE: ServiceState = {
  serviceList: [],
  currentService: null,
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
export type ServiceAction =
  | { type: typeof GET_SERVICES; payload: string }
  | { type: typeof GET_SERVICES_SUCCESS; payload: Service[] }
  | { type: typeof GET_SERVICES_ERROR; payload: any }
  | { type: typeof GET_SERVICE_BY_ID; payload: string }
  | { type: typeof GET_SERVICE_BY_ID_SUCCESS; payload: Service }
  | { type: typeof GET_SERVICE_BY_ID_ERROR; payload: any }
  | { type: typeof CREATE_SERVICE; payload: Partial<Service> }
  | { type: typeof CREATE_SERVICE_SUCCESS; payload: Service }
  | { type: typeof CREATE_SERVICE_ERROR; payload: any }
  | { type: typeof UPDATE_SERVICE; payload: { id: string; data: Partial<Service> } }
  | { type: typeof UPDATE_SERVICE_SUCCESS; payload: Service }
  | { type: typeof UPDATE_SERVICE_ERROR; payload: any }
  | { type: typeof DELETE_SERVICE; payload: string }
  | { type: typeof DELETE_SERVICE_SUCCESS; payload: string }
  | { type: typeof DELETE_SERVICE_ERROR; payload: any }
  | { type: typeof CLEAR_SUCCESS }
  | { type: typeof CLEAR_ERROR }
