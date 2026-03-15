import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'

export interface Branch {
  id: string
  name: string
  salonId: string
  address: string
  city?: string
  phone?: string
  email?: string
  latitude?: number
  longitude?: number
  hours?: any
  is_primary?: boolean
  status?: 'active' | 'inactive' | 'opening-soon'
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export function getBranchesApi(salonId: string): Promise<AxiosResponse<{ data: Branch[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: `/branches/salon/${salonId}`,
  })
}

export function getBranchByIdApi(branchId: string): Promise<AxiosResponse<{ data: Branch }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: `/branches/${branchId}`,
  })
}

export function createBranchApi(branchData: Partial<Branch>): Promise<AxiosResponse<{ data: Branch }>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: '/branches',
    data: branchData,
  })
}

export function updateBranchApi(branchId: string, branchData: Partial<Branch>): Promise<AxiosResponse<{ data: Branch }>> {
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: `/branches/${branchId}`,
    data: branchData,
  })
}

export function deleteBranchApi(branchId: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: `/branches/${branchId}`,
  })
}
