import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import {
  GET_STAFF_URL,
  GET_STAFF_BY_ID_URL,
  GET_STAFF_STATS_URL,
  GET_STAFF_SCHEDULES_URL,
  UPDATE_STAFF_SCHEDULES_URL,
  CREATE_STAFF_URL,
  UPDATE_STAFF_URL,
  DELETE_STAFF_URL,
} from './endPoints'

export interface Staff {
  id: string
  name: string
  role: string
  email?: string
  phone?: string
  bio?: string
  specialties?: string[]
  socials?: Record<string, string>
  experience?: number
  joinedDate?: string
  commissionRate?: number
  avatar?: string
  status?: 'active' | 'inactive' | 'on-leave' | 'blocked'
  rating?: number
  monthlyRevenue?: number
  schedule?: any[]
  [key: string]: any
}

export function getStaffApi(salonId: string): Promise<AxiosResponse<{ data: Staff[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_STAFF_URL.replace('{salonId}', salonId),
  })
}

export function getStaffByIdApi(staffId: string): Promise<AxiosResponse<{ data: Staff }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_STAFF_BY_ID_URL.replace('{id}', staffId),
  })
}

export interface StaffStats {
  totalBookings?: number
  cancelledCount?: number
  rebookingRate?: number | null
  cancelRate?: number
  onTimeRate?: number | null
}

export function getStaffStatsApi(staffId: string): Promise<AxiosResponse<{ data: StaffStats }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_STAFF_STATS_URL.replace('{id}', staffId),
  })
}

export function createStaffApi(staffData: Partial<Staff>): Promise<AxiosResponse<{ data: Staff }>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: CREATE_STAFF_URL,
    data: staffData,
  })
}

export function updateStaffApi(staffId: string, staffData: Partial<Staff>): Promise<AxiosResponse<{ data: Staff }>> {
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: UPDATE_STAFF_URL.replace('{id}', staffId),
    data: staffData,
  })
}

export function deleteStaffApi(staffId: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: DELETE_STAFF_URL.replace('{id}', staffId),
  })
}

export interface StaffScheduleItem {
  id?: string
  staff_id?: string
  day_of_week: number
  day_name?: string
  start_time: string
  end_time: string
}

export function getStaffSchedulesApi(staffId: string): Promise<AxiosResponse<{ data: { schedules: StaffScheduleItem[] }; schedules?: StaffScheduleItem[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_STAFF_SCHEDULES_URL.replace('{id}', staffId),
  })
}

export function updateStaffSchedulesApi(
  staffId: string,
  schedules: Array<{ day_of_week: number; start_time: string; end_time: string }>
): Promise<AxiosResponse<{ data: { schedules: StaffScheduleItem[] }; schedules?: StaffScheduleItem[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: UPDATE_STAFF_SCHEDULES_URL.replace('{id}', staffId),
    data: { schedules },
  })
}
