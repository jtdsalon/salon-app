import * as TYPES from './types'
import type { VacancyState, VacancyAction } from './types'

export const vacancyReducer = (state: VacancyState = TYPES.INITIAL_STATE, action: VacancyAction): VacancyState => {
  switch (action.type) {
    case TYPES.GET_VACANCIES:
      return { ...state, loading: true, error: null }
    case TYPES.GET_VACANCIES_SUCCESS:
      return { ...state, loading: false, vacancyList: action.payload, error: null }
    case TYPES.GET_VACANCIES_ERROR:
      return { ...state, loading: false, error: action.payload }

    case TYPES.GET_VACANCY_BY_ID:
      return { ...state, itemLoading: true, error: null }
    case TYPES.GET_VACANCY_BY_ID_SUCCESS:
      return { ...state, itemLoading: false, currentVacancy: action.payload, error: null }
    case TYPES.GET_VACANCY_BY_ID_ERROR:
      return { ...state, itemLoading: false, error: action.payload }

    case TYPES.CREATE_VACANCY:
      return { ...state, creating: true, error: null, success: false }
    case TYPES.CREATE_VACANCY_SUCCESS:
      return {
        ...state,
        creating: false,
        vacancyList: [action.payload, ...state.vacancyList],
        error: null,
        success: true,
        successMessage: 'Job opening created successfully',
      }
    case TYPES.CREATE_VACANCY_ERROR:
      return { ...state, creating: false, error: action.payload, success: false }

    case TYPES.UPDATE_VACANCY:
      return { ...state, updating: true, error: null, success: false }
    case TYPES.UPDATE_VACANCY_SUCCESS:
      return {
        ...state,
        updating: false,
        vacancyList: state.vacancyList.map(vacancy =>
          vacancy.id === action.payload.id ? action.payload : vacancy
        ),
        currentVacancy: action.payload,
        error: null,
        success: true,
        successMessage: 'Job opening updated successfully',
      }
    case TYPES.UPDATE_VACANCY_ERROR:
      return { ...state, updating: false, error: action.payload, success: false }

    case TYPES.DELETE_VACANCY:
      return { ...state, deleting: true, error: null, success: false }
    case TYPES.DELETE_VACANCY_SUCCESS:
      return {
        ...state,
        deleting: false,
        vacancyList: state.vacancyList.filter(vacancy => vacancy.id !== action.payload),
        currentVacancy: null,
        error: null,
        success: true,
        successMessage: 'Job opening deleted successfully',
      }
    case TYPES.DELETE_VACANCY_ERROR:
      return { ...state, deleting: false, error: action.payload, success: false }

    case TYPES.CLEAR_SUCCESS:
      return { ...state, success: false, successMessage: '' }
    case TYPES.CLEAR_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}
