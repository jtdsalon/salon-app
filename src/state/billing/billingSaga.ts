import { put, takeEvery, call } from 'redux-saga/effects'
import * as TYPES from './types'
import type { BillingAction, Payment, PaymentPagination } from './types'
import {
  getMyPaymentsApi,
  getPaymentByIdApi,
  createPaymentApi,
  processPaymentApi,
  transformPaymentToInvoice,
} from '../../services/api/billingService'

function* getPaymentsSaga(action: Extract<BillingAction, { type: typeof TYPES.GET_PAYMENTS }>) {
  try {
    const response: any = yield call(getMyPaymentsApi, action.payload)
    const { payments, total } = response.data?.data || {}
    const page = action.payload?.page || 1
    const limit = action.payload?.limit || 20

    const pagination: PaymentPagination = {
      page,
      limit,
      total: total || 0,
      pages: Math.ceil((total || 0) / limit),
    }

    // Transform payments to invoices
    const invoices = (payments || []).map((payment: Payment, index: number) =>
      transformPaymentToInvoice(payment, index)
    )

    yield put({
      type: TYPES.GET_PAYMENTS_SUCCESS,
      payload: { payments: payments || [], pagination, invoices },
    })
  } catch (error) {
    yield put({
      type: TYPES.GET_PAYMENTS_ERROR,
      payload: error,
    })
  }
}

function* getPaymentByIdSaga(action: Extract<BillingAction, { type: typeof TYPES.GET_PAYMENT_BY_ID }>) {
  try {
    const response: any = yield call(getPaymentByIdApi, action.payload)
    const payment = response.data?.data

    yield put({
      type: TYPES.GET_PAYMENT_BY_ID_SUCCESS,
      payload: payment,
    })
  } catch (error) {
    yield put({
      type: TYPES.GET_PAYMENT_BY_ID_ERROR,
      payload: error,
    })
  }
}

function* createPaymentSaga(action: Extract<BillingAction, { type: typeof TYPES.CREATE_PAYMENT }>) {
  try {
    const response: any = yield call(createPaymentApi, action.payload)
    const payment = response.data?.data

    yield put({
      type: TYPES.CREATE_PAYMENT_SUCCESS,
      payload: payment,
    })
  } catch (error) {
    yield put({
      type: TYPES.CREATE_PAYMENT_ERROR,
      payload: error,
    })
  }
}

function* processPaymentSaga(action: Extract<BillingAction, { type: typeof TYPES.PROCESS_PAYMENT }>) {
  try {
    const { paymentId, details } = action.payload
    const response: any = yield call(processPaymentApi, paymentId, details)
    const payment = response.data?.data

    yield put({
      type: TYPES.PROCESS_PAYMENT_SUCCESS,
      payload: payment,
    })
  } catch (error) {
    yield put({
      type: TYPES.PROCESS_PAYMENT_ERROR,
      payload: error,
    })
  }
}

export function* billingSaga() {
  yield takeEvery(TYPES.GET_PAYMENTS, getPaymentsSaga)
  yield takeEvery(TYPES.GET_PAYMENT_BY_ID, getPaymentByIdSaga)
  yield takeEvery(TYPES.CREATE_PAYMENT, createPaymentSaga)
  yield takeEvery(TYPES.PROCESS_PAYMENT, processPaymentSaga)
}
