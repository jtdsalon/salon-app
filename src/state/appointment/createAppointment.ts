import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { createAppointmentApi } from '../../services/api/appointmentService'
import { HTTP_CODE } from '../../lib/enums/httpData'
import type { CreateAppointmentPayload } from './types'

// Action creator
export const createAppointment = (appointmentData: CreateAppointmentPayload) => ({
  type: TYPES.CREATE_APPOINTMENT,
  payload: appointmentData,
})

const createAppointmentSuccess = (payload: any) => ({
  type: TYPES.CREATE_APPOINTMENT_SUCCESS,
  payload,
})

const createAppointmentError = (payload: any) => ({
  type: TYPES.CREATE_APPOINTMENT_ERROR,
  payload,
})

// Saga
export function* createAppointmentSaga(action: { payload: CreateAppointmentPayload }): Generator<any, void, any> {
  try {
    const response: any = yield call(createAppointmentApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || {}
      yield put(createAppointmentSuccess(payload))
    } else {
      yield put(createAppointmentError(response))
    }
  } catch (err) {
    yield put(createAppointmentError(err))
  }
}
