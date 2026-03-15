import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import { GET_SALON_CUSTOMERS_URL } from './endPoints'

export interface CustomerBookingHistory {
  id: string
  date: string
  status: string
  services: Array<{ name: string; price: number }> | null
}

export interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar: string | null
  member_since: string
  total_visits: number
  total_spent: number
  last_visit: string | null
  booking_history: CustomerBookingHistory[] | null
}

export interface GetCustomersParams {
  page?: number
  limit?: number
}

export interface GetCustomersResponse {
  data: Customer[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Get salon customers from booking data
export function getSalonCustomersApi(
  salonId: string,
  params: GetCustomersParams = {},
  signal?: AbortSignal
): Promise<AxiosResponse<GetCustomersResponse>> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())

  const url = queryParams.toString()
    ? `${GET_SALON_CUSTOMERS_URL.replace('{salonId}', salonId)}?${queryParams.toString()}`
    : GET_SALON_CUSTOMERS_URL.replace('{salonId}', salonId)

  return networkClient().request({
    method: HTTP_METHOD.GET,
    url,
    ...(signal && { signal }),
  })
}
