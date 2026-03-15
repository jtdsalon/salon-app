// Vacancy Action Types
export const GET_VACANCIES = 'GET_VACANCIES' as const
export const GET_VACANCIES_SUCCESS = 'GET_VACANCIES_SUCCESS' as const
export const GET_VACANCIES_ERROR = 'GET_VACANCIES_ERROR' as const

export const GET_VACANCY_BY_ID = 'GET_VACANCY_BY_ID' as const
export const GET_VACANCY_BY_ID_SUCCESS = 'GET_VACANCY_BY_ID_SUCCESS' as const
export const GET_VACANCY_BY_ID_ERROR = 'GET_VACANCY_BY_ID_ERROR' as const

export const CREATE_VACANCY = 'CREATE_VACANCY' as const
export const CREATE_VACANCY_SUCCESS = 'CREATE_VACANCY_SUCCESS' as const
export const CREATE_VACANCY_ERROR = 'CREATE_VACANCY_ERROR' as const

export const UPDATE_VACANCY = 'UPDATE_VACANCY' as const
export const UPDATE_VACANCY_SUCCESS = 'UPDATE_VACANCY_SUCCESS' as const
export const UPDATE_VACANCY_ERROR = 'UPDATE_VACANCY_ERROR' as const

export const DELETE_VACANCY = 'DELETE_VACANCY' as const
export const DELETE_VACANCY_SUCCESS = 'DELETE_VACANCY_SUCCESS' as const
export const DELETE_VACANCY_ERROR = 'DELETE_VACANCY_ERROR' as const

export const CLEAR_SUCCESS = 'CLEAR_SUCCESS' as const
export const CLEAR_ERROR = 'CLEAR_ERROR' as const

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

export interface VacancyState {
  vacancyList: Vacancy[]
  currentVacancy: Vacancy | null
  loading: boolean
  itemLoading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  error: any
  success: boolean
  successMessage: string
}

export const INITIAL_STATE: VacancyState = {
  vacancyList: [],
  currentVacancy: null,
  loading: false,
  itemLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: false,
  successMessage: '',
}

// Action types
export type VacancyAction =
  | { type: typeof GET_VACANCIES; payload: string }
  | { type: typeof GET_VACANCIES_SUCCESS; payload: Vacancy[] }
  | { type: typeof GET_VACANCIES_ERROR; payload: any }
  | { type: typeof GET_VACANCY_BY_ID; payload: string }
  | { type: typeof GET_VACANCY_BY_ID_SUCCESS; payload: Vacancy }
  | { type: typeof GET_VACANCY_BY_ID_ERROR; payload: any }
  | { type: typeof CREATE_VACANCY; payload: Partial<Vacancy> }
  | { type: typeof CREATE_VACANCY_SUCCESS; payload: Vacancy }
  | { type: typeof CREATE_VACANCY_ERROR; payload: any }
  | { type: typeof UPDATE_VACANCY; payload: { id: string; data: Partial<Vacancy> } }
  | { type: typeof UPDATE_VACANCY_SUCCESS; payload: Vacancy }
  | { type: typeof UPDATE_VACANCY_ERROR; payload: any }
  | { type: typeof DELETE_VACANCY; payload: string }
  | { type: typeof DELETE_VACANCY_SUCCESS; payload: string }
  | { type: typeof DELETE_VACANCY_ERROR; payload: any }
  | { type: typeof CLEAR_SUCCESS }
  | { type: typeof CLEAR_ERROR }
