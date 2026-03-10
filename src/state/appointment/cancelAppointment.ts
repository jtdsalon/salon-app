import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { cancelAppointmentApi } from '../../services/api/appointmentService'
import { HTTP_CODE } from '../../lib/enums/httpData'
import type { CancelAppointmentPayload } from './types'

// Action creator
export const cancelAppointment = (id: string, reason: string) => ({
  type: TYPES.CANCEL_APPOINTMENT,
  payload: { id, reason } as CancelAppointmentPayload,
})

const cancelAppointmentSuccess = (payload: any) => ({
  type: TYPES.CANCEL_APPOINTMENT_SUCCESS,
  payload,
})

const cancelAppointmentError = (payload: any) => ({
  type: TYPES.CANCEL_APPOINTMENT_ERROR,
  payload,
})

// Saga
export function* cancelAppointmentSaga(action: { payload: CancelAppointmentPayload }): Generator<any, void, any> {
  try {
    const { id, reason } = action.payload
    const response: any = yield call(cancelAppointmentApi, id, reason)
    if (response.status === HTTP_CODE.OK) {
      const payload = response.data?.data || response.data || {}
      yield put(cancelAppointmentSuccess(payload))
    } else {
      yield put(cancelAppointmentError(response))
    }
  } catch (err) {
    yield put(cancelAppointmentError(err))
  }
}
