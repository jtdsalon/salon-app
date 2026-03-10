import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import {
  GET_SERVICES_URL,
  GET_SERVICE_BY_ID_URL,
  CREATE_SERVICE_URL,
  UPDATE_SERVICE_URL,
  DELETE_SERVICE_URL,
} from './endPoints'

export interface Service {
  id: string
  name: string
  category: string
  description?: string
  price: number
  duration_minutes: number
  images?: string[]
  is_active?: boolean
  popularity?: number
  [key: string]: any
}

export function getServicesApi(salonId: string): Promise<AxiosResponse<{ data: Service[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_SERVICES_URL.replace('{salonId}', salonId),
  })
}

export function getServiceByIdApi(serviceId: string): Promise<AxiosResponse<{ data: Service }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_SERVICE_BY_ID_URL.replace('{id}', serviceId),
  })
}

function hasFileImages(images: unknown): boolean {
  return Array.isArray(images) && images.some((img) => img instanceof File);
}

export function createServiceApi(serviceData: Partial<Service>): Promise<AxiosResponse<{ data: Service }>> {
  const images = (serviceData as any).images;
  if (hasFileImages(images)) {
    const formData = new FormData();
    const fileImages: File[] = [];
    const existingUrls: string[] = [];
    images.forEach((img: File | string) => {
      if (img instanceof File) fileImages.push(img);
      else if (typeof img === 'string') existingUrls.push(img);
    });
    ['salon_id', 'name', 'category', 'price', 'duration', 'duration_minutes', 'description', 'is_active'].forEach((key) => {
      const val = (serviceData as any)[key];
      if (val != null && val !== '') formData.append(key, String(val));
    });
    formData.append('existing_images', JSON.stringify(existingUrls));
    fileImages.forEach((f) => formData.append('images', f));
    return networkClient().request({
      method: HTTP_METHOD.POST,
      url: CREATE_SERVICE_URL,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: CREATE_SERVICE_URL,
    data: serviceData,
  });
}

export function updateServiceApi(serviceId: string, serviceData: Partial<Service>): Promise<AxiosResponse<{ data: Service }>> {
  const images = (serviceData as any).images;
  if (hasFileImages(images)) {
    const formData = new FormData();
    const fileImages: File[] = [];
    const existingUrls: string[] = [];
    images.forEach((img: File | string) => {
      if (img instanceof File) fileImages.push(img);
      else if (typeof img === 'string') existingUrls.push(img);
    });
    ['name', 'category', 'price', 'duration', 'duration_minutes', 'description', 'is_active'].forEach((key) => {
      const val = (serviceData as any)[key];
      if (val != null && val !== '') formData.append(key, String(val));
    });
    formData.append('existing_images', JSON.stringify(existingUrls));
    fileImages.forEach((f) => formData.append('images', f));
    return networkClient().request({
      method: HTTP_METHOD.PUT,
      url: UPDATE_SERVICE_URL.replace('{id}', serviceId),
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: UPDATE_SERVICE_URL.replace('{id}', serviceId),
    data: serviceData,
  });
}

export function deleteServiceApi(serviceId: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: DELETE_SERVICE_URL.replace('{id}', serviceId),
  })
}
