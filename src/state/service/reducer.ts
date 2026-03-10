import * as TYPES from './types'
import type { ServiceState, ServiceAction } from './types'

export const serviceReducer = (state: ServiceState = TYPES.INITIAL_STATE, action: ServiceAction): ServiceState => {
  switch (action.type) {
    case TYPES.GET_SERVICES:
      return { ...state, loading: true, error: null }
    case TYPES.GET_SERVICES_SUCCESS:
      return { ...state, loading: false, serviceList: action.payload, error: null }
    case TYPES.GET_SERVICES_ERROR:
      return { ...state, loading: false, error: action.payload }

    case TYPES.GET_SERVICE_BY_ID:
      return { ...state, itemLoading: true, error: null }
    case TYPES.GET_SERVICE_BY_ID_SUCCESS:
      return { ...state, itemLoading: false, currentService: action.payload, error: null }
    case TYPES.GET_SERVICE_BY_ID_ERROR:
      return { ...state, itemLoading: false, error: action.payload }

    case TYPES.CREATE_SERVICE:
      return { ...state, creating: true, error: null, success: false }
    case TYPES.CREATE_SERVICE_SUCCESS:
      return {
        ...state,
        creating: false,
        serviceList: [...state.serviceList, action.payload],
        error: null,
        success: true,
        successMessage: 'Ritual added successfully',
      }
    case TYPES.CREATE_SERVICE_ERROR:
      return { ...state, creating: false, error: action.payload, success: false }

    case TYPES.UPDATE_SERVICE:
      return { ...state, updating: true, error: null, success: false }
    case TYPES.UPDATE_SERVICE_SUCCESS:
      return {
        ...state,
        updating: false,
        serviceList: state.serviceList.map(service =>
          service.id === action.payload.id ? action.payload : service
        ),
        currentService: action.payload,
        error: null,
        success: true,
        successMessage: 'Ritual updated successfully',
      }
    case TYPES.UPDATE_SERVICE_ERROR:
      return { ...state, updating: false, error: action.payload, success: false }

    case TYPES.DELETE_SERVICE:
      return { ...state, deleting: true, error: null, success: false }
    case TYPES.DELETE_SERVICE_SUCCESS:
      return {
        ...state,
        deleting: false,
        serviceList: state.serviceList.filter(service => service.id !== action.payload),
        currentService: null,
        error: null,
        success: true,
        successMessage: 'Ritual deleted successfully',
      }
    case TYPES.DELETE_SERVICE_ERROR:
      return { ...state, deleting: false, error: action.payload, success: false }

    case TYPES.CLEAR_SUCCESS:
      return { ...state, success: false, successMessage: '' }
    case TYPES.CLEAR_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}
