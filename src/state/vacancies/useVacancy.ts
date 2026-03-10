import { useDispatch, useSelector } from 'react-redux'
import * as TYPES from './types'
import { RootState } from '../store'

export const useVacancy = () => {
  const dispatch = useDispatch()
  const vacancies = useSelector((state: RootState) => state.vacancies)

  return {
    vacancyList: vacancies.vacancyList,
    currentVacancy: vacancies.currentVacancy,
    loading: vacancies.loading,
    itemLoading: vacancies.itemLoading,
    creating: vacancies.creating,
    updating: vacancies.updating,
    deleting: vacancies.deleting,
    error: vacancies.error,
    success: vacancies.success,
    successMessage: vacancies.successMessage,

    // Actions
    getVacancies: (salonId: string) =>
      dispatch({ type: TYPES.GET_VACANCIES, payload: salonId }),
    getVacancyById: (vacancyId: string) =>
      dispatch({ type: TYPES.GET_VACANCY_BY_ID, payload: vacancyId }),
    createVacancy: (vacancyData: Partial<TYPES.Vacancy>) =>
      dispatch({ type: TYPES.CREATE_VACANCY, payload: vacancyData }),
    updateVacancy: (vacancyId: string, vacancyData: Partial<TYPES.Vacancy>) =>
      dispatch({ type: TYPES.UPDATE_VACANCY, payload: { id: vacancyId, data: vacancyData } }),
    deleteVacancy: (vacancyId: string) =>
      dispatch({ type: TYPES.DELETE_VACANCY, payload: vacancyId }),
    clearSuccess: () => dispatch({ type: TYPES.CLEAR_SUCCESS }),
    clearError: () => dispatch({ type: TYPES.CLEAR_ERROR }),
  }
}
