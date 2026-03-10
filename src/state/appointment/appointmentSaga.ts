import { takeEvery, ForkEffect } from 'redux-saga/effects'
import * as TYPES from './types'
import { getAppointmentsSaga } from './getAppointments'
import { getAppointmentByIdSaga } from './getAppointmentById'
import { getSalonAppointmentsSaga } from './getSalonAppointments'
import { getSalonAppointmentsListSaga } from './getSalonAppointmentsList'
import { createAppointmentSaga } from './createAppointment'
import { updateAppointmentStatusSaga } from './updateAppointmentStatus'
import { cancelAppointmentSaga } from './cancelAppointment'

export function* appointmentSaga(): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery(TYPES.GET_APPOINTMENTS, getAppointmentsSaga as any)
  yield takeEvery(TYPES.GET_APPOINTMENT_BY_ID, getAppointmentByIdSaga as any)
  yield takeEvery(TYPES.GET_SALON_APPOINTMENTS, getSalonAppointmentsSaga as any)
  yield takeEvery(TYPES.GET_SALON_APPOINTMENTS_LIST, getSalonAppointmentsListSaga as any)
  yield takeEvery(TYPES.CREATE_APPOINTMENT, createAppointmentSaga as any)
  yield takeEvery(TYPES.UPDATE_APPOINTMENT_STATUS, updateAppointmentStatusSaga as any)
  yield takeEvery(TYPES.CANCEL_APPOINTMENT, cancelAppointmentSaga as any)
}
