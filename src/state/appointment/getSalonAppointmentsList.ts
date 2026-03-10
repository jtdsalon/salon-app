import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getSalonAppointmentsListApi } from '../../services/api/appointmentService'
import { HTTP_CODE } from '../../lib/enums/httpData'

const getSalonAppointmentsSuccess = (payload: any) => ({
  type: TYPES.GET_SALON_APPOINTMENTS_SUCCESS,
  payload,
})

const getSalonAppointmentsError = (payload: any) => ({
  type: TYPES.GET_SALON_APPOINTMENTS_ERROR,
  payload,
})

export const getSalonAppointmentsList = (
  salonId: string,
  params: { page?: number; limit?: number; status?: string } = {}
) => ({
  type: TYPES.GET_SALON_APPOINTMENTS_LIST,
  payload: { salonId, ...params },
})

export function* getSalonAppointmentsListSaga(
  action: { payload: { salonId: string; page?: number; limit?: number; status?: string } }
): Generator<any, void, any> {
  try {
    const { salonId, page = 1, limit = 100, status } = action.payload
    const response: any = yield call(getSalonAppointmentsListApi, salonId, { page, limit, status })
    if (response.status === HTTP_CODE.OK) {
      const payload = response.data?.data || response.data || []
      yield put(getSalonAppointmentsSuccess(Array.isArray(payload) ? payload : []))
    } else {
      yield put(getSalonAppointmentsError(response))
    }
  } catch (err) {
    yield put(getSalonAppointmentsError(err))
  }
}
