import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getAppointmentByIdApi } from '../../services/api/appointmentService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creator
export const getAppointmentById = (appointmentId: string) => ({
  type: TYPES.GET_APPOINTMENT_BY_ID,
  payload: appointmentId,
})

const getAppointmentByIdSuccess = (payload: any) => ({
  type: TYPES.GET_APPOINTMENT_BY_ID_SUCCESS,
  payload,
})

const getAppointmentByIdError = (payload: any) => ({
  type: TYPES.GET_APPOINTMENT_BY_ID_ERROR,
  payload,
})

// Saga
export function* getAppointmentByIdSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(getAppointmentByIdApi, action.payload)
    if (response.status === HTTP_CODE.OK) {
      const payload = response.data?.data || response.data || {}
      yield put(getAppointmentByIdSuccess(payload))
    } else {
      yield put(getAppointmentByIdError(response))
    }
  } catch (err) {
    yield put(getAppointmentByIdError(err))
  }
}
