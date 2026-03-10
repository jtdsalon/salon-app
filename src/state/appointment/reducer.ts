import * as TYPES from './types'
import type { AppointmentState, AppointmentAction } from './types'

export const appointmentReducer = (
  state: AppointmentState = TYPES.INITIAL_STATE,
  action: AppointmentAction
): AppointmentState => {
  switch (action.type) {
    // Get user's appointments
    case TYPES.GET_APPOINTMENTS:
      return { ...state, loading: true, error: null }
    case TYPES.GET_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: action.payload.appointments,
        pagination: action.payload.pagination,
        error: null,
      }
    case TYPES.GET_APPOINTMENTS_ERROR:
      return { ...state, loading: false, error: action.payload }

    // Get appointment by ID
    case TYPES.GET_APPOINTMENT_BY_ID:
      return { ...state, itemLoading: true, error: null }
    case TYPES.GET_APPOINTMENT_BY_ID_SUCCESS:
      return { ...state, itemLoading: false, currentAppointment: action.payload, error: null }
    case TYPES.GET_APPOINTMENT_BY_ID_ERROR:
      return { ...state, itemLoading: false, error: action.payload }

    // Get salon appointments
    case TYPES.GET_SALON_APPOINTMENTS:
      return { ...state, loading: true, error: null }
    case TYPES.GET_SALON_APPOINTMENTS_SUCCESS:
      return { ...state, loading: false, salonAppointments: action.payload, error: null }
    case TYPES.GET_SALON_APPOINTMENTS_ERROR:
      return { ...state, loading: false, error: action.payload }

    // Create appointment
    case TYPES.CREATE_APPOINTMENT:
      return { ...state, creating: true, error: null, success: false }
    case TYPES.CREATE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        creating: false,
        appointments: [action.payload, ...state.appointments],
        currentAppointment: action.payload,
        error: null,
        success: true,
        successMessage: 'Appointment booked successfully',
      }
    case TYPES.CREATE_APPOINTMENT_ERROR:
      return { ...state, creating: false, error: action.payload, success: false }

    // Update appointment status
    case TYPES.UPDATE_APPOINTMENT_STATUS:
      return { ...state, updating: true, error: null, success: false }
    case TYPES.UPDATE_APPOINTMENT_STATUS_SUCCESS:
      return {
        ...state,
        updating: false,
        appointments: state.appointments.map((apt) =>
          apt.id === action.payload.id ? action.payload : apt
        ),
        salonAppointments: state.salonAppointments.map((apt) =>
          apt.id === action.payload.id ? action.payload : apt
        ),
        currentAppointment: action.payload,
        error: null,
        success: true,
        successMessage: 'Appointment status updated successfully',
      }
    case TYPES.UPDATE_APPOINTMENT_STATUS_ERROR:
      return { ...state, updating: false, error: action.payload, success: false }

    // Cancel appointment
    case TYPES.CANCEL_APPOINTMENT:
      return { ...state, cancelling: true, error: null, success: false }
    case TYPES.CANCEL_APPOINTMENT_SUCCESS:
      return {
        ...state,
        cancelling: false,
        appointments: state.appointments.map((apt) =>
          apt.id === action.payload.id ? action.payload : apt
        ),
        salonAppointments: state.salonAppointments.map((apt) =>
          apt.id === action.payload.id ? action.payload : apt
        ),
        currentAppointment: action.payload,
        error: null,
        success: true,
        successMessage: 'Appointment cancelled successfully',
      }
    case TYPES.CANCEL_APPOINTMENT_ERROR:
      return { ...state, cancelling: false, error: action.payload, success: false }

    // Clear states
    case TYPES.CLEAR_APPOINTMENT_SUCCESS:
      return { ...state, success: false, successMessage: '' }
    case TYPES.CLEAR_APPOINTMENT_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}
