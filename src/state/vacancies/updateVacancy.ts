import { put, call } from 'redux-saga/effects'
import * as TYPES from './types'
import { updateVacancyApi, Vacancy } from '../../services/api/vacancyService'

export function* updateVacancySaga(action: { type: string; payload: { id: string; data: Partial<Vacancy> } }) {
  try {
    const response = yield call(updateVacancyApi, action.payload.id, action.payload.data)
    yield put({
      type: TYPES.UPDATE_VACANCY_SUCCESS,
      payload: response.data.data || response.data,
    })
  } catch (error: any) {
    yield put({
      type: TYPES.UPDATE_VACANCY_ERROR,
      payload: error.response?.data?.message || error.message,
    })
  }
}
