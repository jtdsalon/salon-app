import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import {
  GET_MY_APPOINTMENTS_URL,
  GET_SALON_APPOINTMENTS_LIST_URL,
  GET_APPOINTMENT_BY_ID_URL,
  GET_SALON_APPOINTMENTS_URL,
  CREATE_APPOINTMENT_URL,
  UPDATE_APPOINTMENT_STATUS_URL,
  CANCEL_APPOINTMENT_URL,
} from './endPoints'

export interface Appointment {
  id: string
  salon_id: string
  staff_id: string
  user_id: string
  service_id: string
  booking_date: string
  start_time: string
  end_time: string
  status: string
  created_at?: string
  updated_at?: string
  user?: {
    email: string
    first_name?: string
    last_name?: string
  }
  service?: {
    name: string
    duration_minutes: number
    price: number
  }
  salon?: {
    name: string
  }
  staff?: {
    job_title?: string
    display_name?: string
  }
}

export interface CreateAppointmentPayload {
  salon_id: string
  service_id?: string  // Primary service for backward compatibility
  service_ids?: string[]  // Multiple services support
  services?: Array<{
    id: string
    price: number
    duration_minutes?: number
  }>
  staff_id?: string
  user_id?: string  // When salon admin books on behalf of a customer
  customer_name?: string  // Walk-in customer display name when no user_id
  booking_date: string
  start_time: string
  end_time: string
  notes?: string
}

export interface GetAppointmentsParams {
  page?: number
  limit?: number
  status?: string
}

// Get current user's appointments (customer view)
export function getMyAppointmentsApi(
  params: GetAppointmentsParams = {}
): Promise<AxiosResponse<{ data: Appointment[]; pagination?: { total: number } }>> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.status) queryParams.append('status', params.status)

  const url = queryParams.toString()
    ? `${GET_MY_APPOINTMENTS_URL}?${queryParams.toString()}`
    : GET_MY_APPOINTMENTS_URL

  return networkClient().request({
    method: HTTP_METHOD.GET,
    url,
  })
}

// Get salon's appointments (salon admin view - paginated)
export function getSalonAppointmentsListApi(
  salonId: string,
  params: GetAppointmentsParams = {}
): Promise<AxiosResponse<{ data: Appointment[]; pagination?: { total: number } }>> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.status) queryParams.append('status', params.status)

  const url = `${GET_SALON_APPOINTMENTS_LIST_URL.replace('{salonId}', salonId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url,
  })
}

// Get appointment by ID
export function getAppointmentByIdApi(
  appointmentId: string
): Promise<AxiosResponse<{ data: Appointment }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_APPOINTMENT_BY_ID_URL.replace('{id}', appointmentId),
  })
}

// Get salon appointments for a specific date
export function getSalonAppointmentsApi(
  salonId: string,
  date: string
): Promise<AxiosResponse<{ data: Appointment[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: `${GET_SALON_APPOINTMENTS_URL.replace('{salonId}', salonId)}?date=${date}`,
  })
}

// Create a new appointment
export function createAppointmentApi(
  appointmentData: CreateAppointmentPayload
): Promise<AxiosResponse<{ data: Appointment }>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: CREATE_APPOINTMENT_URL,
    data: appointmentData,
  })
}

// Update appointment status
export function updateAppointmentStatusApi(
  appointmentId: string,
  status: string
): Promise<AxiosResponse<{ data: Appointment }>> {
  return networkClient().request({
    method: HTTP_METHOD.PATCH,
    url: UPDATE_APPOINTMENT_STATUS_URL.replace('{id}', appointmentId),
    data: { status },
  })
}

// Cancel appointment
export function cancelAppointmentApi(
  appointmentId: string,
  reason: string
): Promise<AxiosResponse<{ data: Appointment }>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: CANCEL_APPOINTMENT_URL.replace('{id}', appointmentId),
    data: { reason },
  })
}
