// Appointment Action Types
export const GET_APPOINTMENTS = 'GET_APPOINTMENTS'
export const GET_APPOINTMENTS_SUCCESS = 'GET_APPOINTMENTS_SUCCESS'
export const GET_APPOINTMENTS_ERROR = 'GET_APPOINTMENTS_ERROR'

export const GET_APPOINTMENT_BY_ID = 'GET_APPOINTMENT_BY_ID'
export const GET_APPOINTMENT_BY_ID_SUCCESS = 'GET_APPOINTMENT_BY_ID_SUCCESS'
export const GET_APPOINTMENT_BY_ID_ERROR = 'GET_APPOINTMENT_BY_ID_ERROR'

export const GET_SALON_APPOINTMENTS = 'GET_SALON_APPOINTMENTS'
export const GET_SALON_APPOINTMENTS_LIST = 'GET_SALON_APPOINTMENTS_LIST'
export const GET_SALON_APPOINTMENTS_SUCCESS = 'GET_SALON_APPOINTMENTS_SUCCESS'
export const GET_SALON_APPOINTMENTS_ERROR = 'GET_SALON_APPOINTMENTS_ERROR'

export const CREATE_APPOINTMENT = 'CREATE_APPOINTMENT'
export const CREATE_APPOINTMENT_SUCCESS = 'CREATE_APPOINTMENT_SUCCESS'
export const CREATE_APPOINTMENT_ERROR = 'CREATE_APPOINTMENT_ERROR'

export const UPDATE_APPOINTMENT_STATUS = 'UPDATE_APPOINTMENT_STATUS'
export const UPDATE_APPOINTMENT_STATUS_SUCCESS = 'UPDATE_APPOINTMENT_STATUS_SUCCESS'
export const UPDATE_APPOINTMENT_STATUS_ERROR = 'UPDATE_APPOINTMENT_STATUS_ERROR'

export const CANCEL_APPOINTMENT = 'CANCEL_APPOINTMENT'
export const CANCEL_APPOINTMENT_SUCCESS = 'CANCEL_APPOINTMENT_SUCCESS'
export const CANCEL_APPOINTMENT_ERROR = 'CANCEL_APPOINTMENT_ERROR'

export const CLEAR_APPOINTMENT_SUCCESS = 'CLEAR_APPOINTMENT_SUCCESS'
export const CLEAR_APPOINTMENT_ERROR = 'CLEAR_APPOINTMENT_ERROR'

// Booking status enum
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'

// Appointment interface
export interface Appointment {
  id: string
  salon_id: string
  staff_id: string
  user_id: string
  service_id: string
  booking_date: string
  start_time: string
  end_time: string
  status: BookingStatus
  created_at?: string
  updated_at?: string
  // Nested relations
  user?: {
    email: string
    first_name?: string
    last_name?: string
  }
  service?: {
    name: string
    duration_minutes: number
    price: number
  }
  salon?: {
    name: string
  }
  staff?: {
    job_title?: string
    display_name?: string
  }
}

export interface CreateAppointmentPayload {
  salon_id: string
  service_id: string
  staff_id: string
  booking_date: string
  start_time: string
  end_time: string
  notes?: string
}

export interface UpdateStatusPayload {
  id: string
  status: BookingStatus
}

export interface CancelAppointmentPayload {
  id: string
  reason: string
}

export interface AppointmentPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AppointmentState {
  appointments: Appointment[]
  salonAppointments: Appointment[]
  currentAppointment: Appointment | null
  pagination: AppointmentPagination | null
  loading: boolean
  itemLoading: boolean
  creating: boolean
  updating: boolean
  cancelling: boolean
  error: any
  success: boolean
  successMessage: string
}

export const INITIAL_STATE: AppointmentState = {
  appointments: [],
  salonAppointments: [],
  currentAppointment: null,
  pagination: null,
  loading: false,
  itemLoading: false,
  creating: false,
  updating: false,
  cancelling: false,
  error: null,
  success: false,
  successMessage: '',
}

// Action types union
export type AppointmentAction =
  | { type: typeof GET_APPOINTMENTS; payload: { page?: number; limit?: number; status?: BookingStatus } }
  | { type: typeof GET_APPOINTMENTS_SUCCESS; payload: { appointments: Appointment[]; pagination: AppointmentPagination } }
  | { type: typeof GET_APPOINTMENTS_ERROR; payload: any }
  | { type: typeof GET_APPOINTMENT_BY_ID; payload: string }
  | { type: typeof GET_APPOINTMENT_BY_ID_SUCCESS; payload: Appointment }
  | { type: typeof GET_APPOINTMENT_BY_ID_ERROR; payload: any }
  | { type: typeof GET_SALON_APPOINTMENTS; payload: { salonId: string; date: string } }
  | { type: typeof GET_SALON_APPOINTMENTS_LIST; payload: { salonId: string; page?: number; limit?: number; status?: string } }
  | { type: typeof GET_SALON_APPOINTMENTS_SUCCESS; payload: Appointment[] }
  | { type: typeof GET_SALON_APPOINTMENTS_ERROR; payload: any }
  | { type: typeof CREATE_APPOINTMENT; payload: CreateAppointmentPayload }
  | { type: typeof CREATE_APPOINTMENT_SUCCESS; payload: Appointment }
  | { type: typeof CREATE_APPOINTMENT_ERROR; payload: any }
  | { type: typeof UPDATE_APPOINTMENT_STATUS; payload: UpdateStatusPayload }
  | { type: typeof UPDATE_APPOINTMENT_STATUS_SUCCESS; payload: Appointment }
  | { type: typeof UPDATE_APPOINTMENT_STATUS_ERROR; payload: any }
  | { type: typeof CANCEL_APPOINTMENT; payload: CancelAppointmentPayload }
  | { type: typeof CANCEL_APPOINTMENT_SUCCESS; payload: Appointment }
  | { type: typeof CANCEL_APPOINTMENT_ERROR; payload: any }
  | { type: typeof CLEAR_APPOINTMENT_SUCCESS }
  | { type: typeof CLEAR_APPOINTMENT_ERROR }
