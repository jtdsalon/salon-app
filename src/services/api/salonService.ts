import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import { GET_SALONS_URL, GET_SALON_DETAIL_URL, FOLLOW_PAGE_URL, UNFOLLOW_PAGE_URL } from './endPoints'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function getSalonsApi(page = 1, limit = 10): Promise<AxiosResponse<PaginatedResponse<any>>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_SALONS_URL,
    params: { page, limit }
  })
}

export function getSalonApi(salonId: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_SALON_DETAIL_URL.replace('{salonId}', salonId)
  })
}

export function updateSalonProfileApi(salonId: string, profileData: any): Promise<AxiosResponse<any>> {
  // Transform operatingHours to hours for backend compatibility
  const transformedData = { ...profileData };
  if (transformedData.operatingHours && !transformedData.hours) {
    transformedData.hours = transformedData.operatingHours;
    delete transformedData.operatingHours;
  }
  const socials = transformedData.socials;

  // If profileData contains File objects (avatar or cover), use FormData
  if (transformedData.avatar instanceof File || transformedData.cover instanceof File) {
    const formData = new FormData();
    
    // Add all non-file, non-array, non-object fields (objects handled below)
    Object.keys(transformedData).forEach(key => {
      const val = transformedData[key];
      if (val === undefined || val === null || val === '') return;
      if (val instanceof File || Array.isArray(val)) return;
      if (typeof val === 'object' && val !== null) return;
      formData.append(key, String(val));
    });

    // Serialize hours array as JSON string
    if (Array.isArray(transformedData.hours) && transformedData.hours.length > 0) {
      formData.append('hours', JSON.stringify(transformedData.hours));
    }

    // Flatten socials fields so backend doesn't receive a JSON string for `socials`
    if (socials && typeof socials === 'object') {
      if (socials.website != null) {
        formData.append('website', String(socials.website));
      }
      if (socials.facebook != null) {
        formData.append('facebook', String(socials.facebook));
      }
      if (socials.instagram != null) {
        formData.append('instagram', String(socials.instagram));
      }
      if (socials.tiktok != null) {
        formData.append('tiktok', String(socials.tiktok));
      }
      delete transformedData.socials;
    }
    
    // Add file fields
    if (transformedData.avatar instanceof File) {
      formData.append('avatar', transformedData.avatar);
    }
    if (transformedData.cover instanceof File) {
      formData.append('cover', transformedData.cover);
    }
    
    return networkClient().request({
      method: HTTP_METHOD.PUT,
      url: `/salons/${salonId}/profile`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  // Otherwise, send as regular JSON (no file uploads)
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: `/salons/${salonId}/profile`,
    data: transformedData
  })
}

export function updateOperatingHoursApi(salonId: string, operatingHours: any[]): Promise<AxiosResponse<any>> {
  // Send as hours field (backend expects hours, not operatingHours)
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: `/salons/${salonId}/operating-hours`,
    data: { hours: operatingHours }
  })
}

export function updateSalonApi(salonId: string, updateData: any): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: `/salons/${salonId}`,
    data: updateData
  })
}

export function createSalonApi(salonData: any): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: '/salons',
    data: salonData
  })
}

export function followPageApi(pageId: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: FOLLOW_PAGE_URL.replace('{pageId}', pageId),
  })
}

export function unfollowPageApi(pageId: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: UNFOLLOW_PAGE_URL.replace('{pageId}', pageId),
  })
}
