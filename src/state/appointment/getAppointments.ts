import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getMyAppointmentsApi } from '../../services/api/appointmentService'
import { HTTP_CODE } from '../../lib/enums/httpData'
import type { BookingStatus } from './types'

// Action creator
export const getAppointments = (params: { page?: number; limit?: number; status?: BookingStatus } = {}) => ({
  type: TYPES.GET_APPOINTMENTS,
  payload: params,
})

const getAppointmentsSuccess = (payload: any) => ({
  type: TYPES.GET_APPOINTMENTS_SUCCESS,
  payload,
})

const getAppointmentsError = (payload: any) => ({
  type: TYPES.GET_APPOINTMENTS_ERROR,
  payload,
})

// Saga
export function* getAppointmentsSaga(action: { payload: any }): Generator<any, void, any> {
  try {
    const response: any = yield call(getMyAppointmentsApi, action.payload)
    if (response.status === HTTP_CODE.OK) {
      const data = response.data?.data || response.data || {}
      yield put(
        getAppointmentsSuccess({
          appointments: data.bookings || data || [],
          pagination: data.pagination || {
            page: action.payload.page || 1,
            limit: action.payload.limit || 20,
            total: data.total || 0,
            pages: Math.ceil((data.total || 0) / (action.payload.limit || 20)),
          },
        })
      )
    } else {
      yield put(getAppointmentsError(response))
    }
  } catch (err) {
    yield put(getAppointmentsError(err))
  }
}
