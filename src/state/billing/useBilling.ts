import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import * as TYPES from './types'
import type { CreatePaymentPayload, ProcessPaymentPayload, PaymentStatus } from './types'

export const useBilling = () => {
  const dispatch = useDispatch()
  const billingState = useSelector((state: RootState) => state.billing)

  const getPayments = (page: number = 1, limit: number = 20, status?: PaymentStatus) => {
    dispatch({
      type: TYPES.GET_PAYMENTS,
      payload: { page, limit, status },
    })
  }

  const getPaymentById = (paymentId: string) => {
    dispatch({
      type: TYPES.GET_PAYMENT_BY_ID,
      payload: paymentId,
    })
  }

  const createPayment = (paymentData: CreatePaymentPayload) => {
    dispatch({
      type: TYPES.CREATE_PAYMENT,
      payload: paymentData,
    })
  }

  const processPayment = (paymentId: string, details: ProcessPaymentPayload) => {
    dispatch({
      type: TYPES.PROCESS_PAYMENT,
      payload: { paymentId, details },
    })
  }

  const clearSuccess = () => {
    dispatch({ type: TYPES.CLEAR_PAYMENT_SUCCESS })
  }

  const clearError = () => {
    dispatch({ type: TYPES.CLEAR_PAYMENT_ERROR })
  }

  return {
    ...billingState,
    getPayments,
    getPaymentById,
    createPayment,
    processPayment,
    clearSuccess,
    clearError,
  }
}
