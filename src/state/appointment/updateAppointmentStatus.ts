import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { updateAppointmentStatusApi } from '../../services/api/appointmentService'
import { HTTP_CODE } from '../../lib/enums/httpData'
import type { UpdateStatusPayload } from './types'

// Action creator
export const updateAppointmentStatus = (id: string, status: TYPES.BookingStatus) => ({
  type: TYPES.UPDATE_APPOINTMENT_STATUS,
  payload: { id, status } as UpdateStatusPayload,
})

const updateAppointmentStatusSuccess = (payload: any) => ({
  type: TYPES.UPDATE_APPOINTMENT_STATUS_SUCCESS,
  payload,
})

const updateAppointmentStatusError = (payload: any) => ({
  type: TYPES.UPDATE_APPOINTMENT_STATUS_ERROR,
  payload,
})

// Saga
export function* updateAppointmentStatusSaga(action: { payload: UpdateStatusPayload }): Generator<any, void, any> {
  try {
    const { id, status } = action.payload
    const response: any = yield call(updateAppointmentStatusApi, id, status)
    if (response.status === HTTP_CODE.OK) {
      const payload = response.data?.data || response.data || {}
      yield put(updateAppointmentStatusSuccess(payload))
    } else {
      yield put(updateAppointmentStatusError(response))
    }
  } catch (err) {
    yield put(updateAppointmentStatusError(err))
  }
}
