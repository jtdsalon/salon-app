import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getSalonAppointmentsApi } from '../../services/api/appointmentService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creator
export const getSalonAppointments = (salonId: string, date: string) => ({
  type: TYPES.GET_SALON_APPOINTMENTS,
  payload: { salonId, date },
})

const getSalonAppointmentsSuccess = (payload: any) => ({
  type: TYPES.GET_SALON_APPOINTMENTS_SUCCESS,
  payload,
})

const getSalonAppointmentsError = (payload: any) => ({
  type: TYPES.GET_SALON_APPOINTMENTS_ERROR,
  payload,
})

// Saga
export function* getSalonAppointmentsSaga(action: { payload: { salonId: string; date: string } }): Generator<any, void, any> {
  try {
    const { salonId, date } = action.payload
    const response: any = yield call(getSalonAppointmentsApi, salonId, date)
    if (response.status === HTTP_CODE.OK) {
      const payload = response.data?.data || response.data || []
      yield put(getSalonAppointmentsSuccess(payload))
    } else {
      yield put(getSalonAppointmentsError(response))
    }
  } catch (err) {
    yield put(getSalonAppointmentsError(err))
  }
}
