// Salon Action Types
export const GET_SALON = 'GET_SALON' as const
export const GET_SALON_SUCCESS = 'GET_SALON_SUCCESS' as const
export const GET_SALON_ERROR = 'GET_SALON_ERROR' as const

export const GET_CATEGORIES = 'GET_CATEGORIES' as const
export const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS' as const
export const GET_CATEGORIES_ERROR = 'GET_CATEGORIES_ERROR' as const

export const UPDATE_SALON_PROFILE = 'UPDATE_SALON_PROFILE' as const
export const UPDATE_SALON_PROFILE_SUCCESS = 'UPDATE_SALON_PROFILE_SUCCESS' as const
export const UPDATE_SALON_PROFILE_ERROR = 'UPDATE_SALON_PROFILE_ERROR' as const

export const UPDATE_OPERATING_HOURS = 'UPDATE_OPERATING_HOURS' as const
export const UPDATE_OPERATING_HOURS_SUCCESS = 'UPDATE_OPERATING_HOURS_SUCCESS' as const
export const UPDATE_OPERATING_HOURS_ERROR = 'UPDATE_OPERATING_HOURS_ERROR' as const

export const CREATE_SALON = 'CREATE_SALON' as const
export const CREATE_SALON_SUCCESS = 'CREATE_SALON_SUCCESS' as const
export const CREATE_SALON_ERROR = 'CREATE_SALON_ERROR' as const

export const CLEAR_SUCCESS = 'CLEAR_SUCCESS' as const
export const CLEAR_UPDATE_ERROR = 'CLEAR_UPDATE_ERROR' as const

export interface Salon {
  id: string
  name: string
  handle?: string
  bio?: string
  city?: string
  area?: string
  category?: string
  description?: string
  address?: string
  avatar?: string
  cover?: string
  latitude?: number
  longitude?: number
  image_url?: string
  cover_image_url?: string
  socials?: Record<string, string>
  hours?: Record<string, any>
  meta?: Record<string, any>
  is_verified?: boolean
  sponsored?: boolean
  is_active?: boolean
  [key: string]: any
}

export interface OperatingHour {
  day: string
  open: string
  close: string
  isOpen: boolean
}

export interface PaginationState {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SalonState {
  salon: Salon | null
  categories: string[]
  loading: boolean
  categoriesLoading: boolean
  updating: boolean
  updatingHours: boolean
  error: any
  updateError: any
  success: boolean
}

export const INITIAL_STATE: SalonState = {
  salon: null,
  categories: [],
  loading: false,
  categoriesLoading: false,
  updating: false,
  updatingHours: false,
  error: null,
  updateError: null,
  success: false,
}

// Action types
export type SalonAction =
  | { type: typeof GET_SALON; payload: string }
  | { type: typeof GET_SALON_SUCCESS; payload: Salon }
  | { type: typeof GET_SALON_ERROR; payload: any }
  | { type: typeof GET_CATEGORIES }
  | { type: typeof GET_CATEGORIES_SUCCESS; payload: string[] }
  | { type: typeof GET_CATEGORIES_ERROR; payload: any }
  | { type: typeof UPDATE_SALON_PROFILE; payload: { salonId: string; profileData: Partial<Salon> } }
  | { type: typeof UPDATE_SALON_PROFILE_SUCCESS; payload: Salon }
  | { type: typeof UPDATE_SALON_PROFILE_ERROR; payload: any }
  | { type: typeof UPDATE_OPERATING_HOURS; payload: { salonId: string; operatingHours: OperatingHour[] } }
  | { type: typeof UPDATE_OPERATING_HOURS_SUCCESS; payload: OperatingHour[] }
  | { type: typeof UPDATE_OPERATING_HOURS_ERROR; payload: any }
  | { type: typeof CREATE_SALON; payload: Partial<Salon> }
  | { type: typeof CREATE_SALON_SUCCESS; payload: Salon }
  | { type: typeof CREATE_SALON_ERROR; payload: any }
  | { type: typeof CLEAR_SUCCESS }
  | { type: typeof CLEAR_UPDATE_ERROR }
