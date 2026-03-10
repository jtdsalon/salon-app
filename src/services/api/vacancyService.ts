import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import {
  GET_VACANCIES_URL,
  GET_VACANCY_BY_ID_URL,
  CREATE_VACANCY_URL,
  UPDATE_VACANCY_URL,
  DELETE_VACANCY_URL,
} from './endPoints'

export interface Vacancy {
  id: string
  title: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  description: string
  requirements: string[]
  experience: string
  salaryRange?: string
  status: 'Open' | 'Closed'
  postedDate: string
  contactEmail: string
  contactPhone?: string
  address?: string
  salonId?: string
  [key: string]: any
}

/**
 * Convert vacancy data from camelCase (frontend) to snake_case (backend)
 */
const convertToSnakeCase = (data: Partial<Vacancy>): any => {
  const converted: any = {}

  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'salonId':
        converted.salon_id = value
        break
      case 'contactEmail':
        converted.contact_email = value
        break
      case 'contactPhone':
        converted.contact_phone = value
        break
      case 'salaryRange':
        converted.salary_range = value
        break
      case 'postedDate':
        converted.posted_date = value
        break
      default:
        converted[key] = value
    }
  }

  return converted
}

export function getVacanciesApi(salonId: string): Promise<AxiosResponse<{ data: Vacancy[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_VACANCIES_URL.replace('{salonId}', salonId),
  })
}

export function getVacancyByIdApi(vacancyId: string): Promise<AxiosResponse<{ data: Vacancy }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_VACANCY_BY_ID_URL.replace('{id}', vacancyId),
  })
}

export function createVacancyApi(vacancyData: Partial<Vacancy>): Promise<AxiosResponse<{ data: Vacancy }>> {
  const snakeCaseData = convertToSnakeCase(vacancyData)
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: CREATE_VACANCY_URL,
    data: snakeCaseData,
  })
}

export function updateVacancyApi(vacancyId: string, vacancyData: Partial<Vacancy>): Promise<AxiosResponse<{ data: Vacancy }>> {
  const snakeCaseData = convertToSnakeCase(vacancyData)
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: UPDATE_VACANCY_URL.replace('{id}', vacancyId),
    data: snakeCaseData,
  })
}

export function deleteVacancyApi(vacancyId: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: DELETE_VACANCY_URL.replace('{id}', vacancyId),
  })
}
