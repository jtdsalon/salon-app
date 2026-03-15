import * as TYPES from './types'
import type { SalonState, SalonAction } from './types'

export const salonReducer = (state: SalonState = TYPES.INITIAL_STATE, action: SalonAction): SalonState => {
  switch (action.type) {
    case TYPES.GET_SALON:
      return { ...state, loading: true, error: null }
    case TYPES.GET_SALON_SUCCESS:
      return { ...state, loading: false, salon: action.payload, error: null }
    case TYPES.GET_SALON_ERROR:
      return { ...state, loading: false, error: action.payload }

    case TYPES.GET_CATEGORIES:
      return { ...state, categoriesLoading: true, error: null }
    case TYPES.GET_CATEGORIES_SUCCESS:
      return { ...state, categoriesLoading: false, categories: action.payload, error: null }
    case TYPES.GET_CATEGORIES_ERROR:
      return { ...state, categoriesLoading: false, error: action.payload }

    case TYPES.UPDATE_SALON_PROFILE:
      return { ...state, updating: true, updateError: null, success: false }
    case TYPES.UPDATE_SALON_PROFILE_SUCCESS:
      return {
        ...state,
        updating: false,
        salon: action.payload,
        updateError: null,
        success: true,
      }
    case TYPES.UPDATE_SALON_PROFILE_ERROR:
      return { ...state, updating: false, updateError: action.payload, success: false }

    case TYPES.UPDATE_OPERATING_HOURS:
      return { ...state, updatingHours: true, updateError: null, success: false }
    case TYPES.UPDATE_OPERATING_HOURS_SUCCESS:
      return {
        ...state,
        updatingHours: false,
        salon: state.salon ? { ...state.salon, hours: action.payload } : null,
        updateError: null,
        success: true,
      }
    case TYPES.UPDATE_OPERATING_HOURS_ERROR:
      return { ...state, updatingHours: false, updateError: action.payload, success: false }

    case TYPES.CREATE_SALON:
      return { ...state, updating: true, updateError: null, success: false }
    case TYPES.CREATE_SALON_SUCCESS:
      return {
        ...state,
        updating: false,
        salon: action.payload,
        updateError: null,
        success: true,
      }
    case TYPES.CREATE_SALON_ERROR:
      return { ...state, updating: false, updateError: action.payload, success: false }

    case TYPES.CLEAR_SUCCESS:
      return { ...state, success: false }
    case TYPES.CLEAR_UPDATE_ERROR:
      return { ...state, updateError: null }

    default:
      return state
  }
}
