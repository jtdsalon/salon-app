export * from './types'
export { appointmentReducer } from './reducer'
export { getAppointments, getAppointmentsSaga } from './getAppointments'
export { getAppointmentById, getAppointmentByIdSaga } from './getAppointmentById'
export { getSalonAppointments, getSalonAppointmentsSaga } from './getSalonAppointments'
export { createAppointment, createAppointmentSaga } from './createAppointment'
export { updateAppointmentStatus, updateAppointmentStatusSaga } from './updateAppointmentStatus'
export { cancelAppointment, cancelAppointmentSaga } from './cancelAppointment'
export { appointmentSaga } from './appointmentSaga'
export { useAppointment } from './useAppointment'

// Clear actions
export const clearAppointmentSuccess = () => ({ type: 'CLEAR_APPOINTMENT_SUCCESS' as const })
export const clearAppointmentError = () => ({ type: 'CLEAR_APPOINTMENT_ERROR' as const })
