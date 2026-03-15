import * as TYPES from './types'
import type { StaffState, StaffAction } from './types'

export const staffReducer = (state: StaffState = TYPES.INITIAL_STATE, action: StaffAction): StaffState => {
  switch (action.type) {
    case TYPES.GET_STAFF:
      return { ...state, loading: true, error: null }
    case TYPES.GET_STAFF_SUCCESS:
      return { ...state, loading: false, staffList: action.payload, error: null }
    case TYPES.GET_STAFF_ERROR:
      return { ...state, loading: false, error: action.payload }

    case TYPES.GET_STAFF_BY_ID:
      return { ...state, itemLoading: true, error: null }
    case TYPES.GET_STAFF_BY_ID_SUCCESS:
      return { ...state, itemLoading: false, currentStaff: action.payload, error: null }
    case TYPES.GET_STAFF_BY_ID_ERROR:
      return { ...state, itemLoading: false, error: action.payload }

    case TYPES.CREATE_STAFF:
      return { ...state, creating: true, error: null, success: false }
    case TYPES.CREATE_STAFF_SUCCESS:
      return {
        ...state,
        creating: false,
        staffList: [...state.staffList, action.payload],
        error: null,
        success: true,
        successMessage: 'Staff member created successfully',
      }
    case TYPES.CREATE_STAFF_ERROR:
      return { ...state, creating: false, error: action.payload, success: false }

    case TYPES.UPDATE_STAFF:
      return { ...state, updating: true, error: null, success: false }
    case TYPES.UPDATE_STAFF_SUCCESS:
      return {
        ...state,
        updating: false,
        staffList: state.staffList.map(staff =>
          staff.id === action.payload.id ? action.payload : staff
        ),
        currentStaff: action.payload,
        error: null,
        success: true,
        successMessage: 'Staff member updated successfully',
      }
    case TYPES.UPDATE_STAFF_ERROR:
      return { ...state, updating: false, error: action.payload, success: false }

    case TYPES.DELETE_STAFF:
      return { ...state, deleting: true, error: null, success: false }
    case TYPES.DELETE_STAFF_SUCCESS:
      return {
        ...state,
        deleting: false,
        staffList: state.staffList.filter(staff => staff.id !== action.payload),
        currentStaff: null,
        error: null,
        success: true,
        successMessage: 'Staff member deleted successfully',
      }
    case TYPES.DELETE_STAFF_ERROR:
      return { ...state, deleting: false, error: action.payload, success: false }

    case TYPES.CLEAR_SUCCESS:
      return { ...state, success: false, successMessage: '' }
    case TYPES.CLEAR_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}
