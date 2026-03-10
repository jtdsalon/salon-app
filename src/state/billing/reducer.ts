import * as TYPES from './types'
import type { BillingState, BillingAction } from './types'

export const billingReducer = (
  state: BillingState = TYPES.INITIAL_STATE,
  action: BillingAction
): BillingState => {
  switch (action.type) {
    // Get payments
    case TYPES.GET_PAYMENTS:
      return { ...state, loading: true, error: null }
    case TYPES.GET_PAYMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        payments: action.payload.payments,
        pagination: action.payload.pagination,
        error: null,
      }
    case TYPES.GET_PAYMENTS_ERROR:
      return { ...state, loading: false, error: action.payload }

    // Get payment by ID
    case TYPES.GET_PAYMENT_BY_ID:
      return { ...state, itemLoading: true, error: null }
    case TYPES.GET_PAYMENT_BY_ID_SUCCESS:
      return { ...state, itemLoading: false, currentPayment: action.payload, error: null }
    case TYPES.GET_PAYMENT_BY_ID_ERROR:
      return { ...state, itemLoading: false, error: action.payload }

    // Create payment
    case TYPES.CREATE_PAYMENT:
      return { ...state, creating: true, error: null, success: false }
    case TYPES.CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        creating: false,
        payments: [action.payload, ...state.payments],
        currentPayment: action.payload,
        error: null,
        success: true,
        successMessage: 'Payment created successfully',
      }
    case TYPES.CREATE_PAYMENT_ERROR:
      return { ...state, creating: false, error: action.payload, success: false }

    // Process payment
    case TYPES.PROCESS_PAYMENT:
      return { ...state, processing: true, error: null, success: false }
    case TYPES.PROCESS_PAYMENT_SUCCESS:
      return {
        ...state,
        processing: false,
        payments: state.payments.map((pmt) =>
          pmt.id === action.payload.id ? action.payload : pmt
        ),
        currentPayment: action.payload,
        error: null,
        success: true,
        successMessage: 'Payment processed successfully',
      }
    case TYPES.PROCESS_PAYMENT_ERROR:
      return { ...state, processing: false, error: action.payload, success: false }

    // Clear states
    case TYPES.CLEAR_PAYMENT_SUCCESS:
      return { ...state, success: false, successMessage: '' }
    case TYPES.CLEAR_PAYMENT_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}
