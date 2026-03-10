import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import type { RootState } from '../store'
import type { AppointmentState, BookingStatus, CreateAppointmentPayload } from './types'
import { CLEAR_APPOINTMENT_SUCCESS, CLEAR_APPOINTMENT_ERROR } from './types'
import { getAppointments } from './getAppointments'
import { getAppointmentById } from './getAppointmentById'
import { getSalonAppointments } from './getSalonAppointments'
import { getSalonAppointmentsList } from './getSalonAppointmentsList'
import { createAppointment } from './createAppointment'
import { updateAppointmentStatus } from './updateAppointmentStatus'
import { cancelAppointment } from './cancelAppointment'

// Clear actions
const clearAppointmentSuccess = () => ({ type: CLEAR_APPOINTMENT_SUCCESS })
const clearAppointmentError = () => ({ type: CLEAR_APPOINTMENT_ERROR })

export const useAppointment = () => {
  const dispatch = useDispatch()
  const appointmentState = useSelector<RootState, AppointmentState>((state) => state.appointment)

  const fetchAppointments = useCallback(
    (params: { page?: number; limit?: number; status?: BookingStatus } = {}) => {
      dispatch(getAppointments(params))
    },
    [dispatch]
  )

  const fetchAppointmentById = useCallback(
    (appointmentId: string) => {
      dispatch(getAppointmentById(appointmentId))
    },
    [dispatch]
  )

  const fetchSalonAppointments = useCallback(
    (salonId: string, date: string) => {
      dispatch(getSalonAppointments(salonId, date))
    },
    [dispatch]
  )

  const fetchSalonAppointmentsList = useCallback(
    (salonId: string, params?: { page?: number; limit?: number; status?: string }) => {
      dispatch(getSalonAppointmentsList(salonId, params || {}))
    },
    [dispatch]
  )

  const bookAppointment = useCallback(
    (appointmentData: CreateAppointmentPayload) => {
      dispatch(createAppointment(appointmentData))
    },
    [dispatch]
  )

  const changeAppointmentStatus = useCallback(
    (id: string, status: BookingStatus) => {
      dispatch(updateAppointmentStatus(id, status))
    },
    [dispatch]
  )

  const cancelUserAppointment = useCallback(
    (id: string, reason: string) => {
      dispatch(cancelAppointment(id, reason))
    },
    [dispatch]
  )

  const clearSuccess = useCallback(() => {
    dispatch(clearAppointmentSuccess())
  }, [dispatch])

  const clearError = useCallback(() => {
    dispatch(clearAppointmentError())
  }, [dispatch])

  return {
    // State
    appointments: appointmentState.appointments,
    salonAppointments: appointmentState.salonAppointments,
    currentAppointment: appointmentState.currentAppointment,
    pagination: appointmentState.pagination,
    loading: appointmentState.loading,
    itemLoading: appointmentState.itemLoading,
    creating: appointmentState.creating,
    updating: appointmentState.updating,
    cancelling: appointmentState.cancelling,
    error: appointmentState.error,
    success: appointmentState.success,
    successMessage: appointmentState.successMessage,
    // Actions
    fetchAppointments,
    fetchAppointmentById,
    fetchSalonAppointments,
    fetchSalonAppointmentsList,
    bookAppointment,
    changeAppointmentStatus,
    cancelUserAppointment,
    clearSuccess,
    clearError,
  }
}
