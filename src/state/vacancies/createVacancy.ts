import { put, call } from 'redux-saga/effects'
import * as TYPES from './types'
import { createVacancyApi, Vacancy } from '../../services/api/vacancyService'

export function* createVacancySaga(action: { type: string; payload: Partial<Vacancy> }) {
  try {
    const response = yield call(createVacancyApi, action.payload)
    yield put({
      type: TYPES.CREATE_VACANCY_SUCCESS,
      payload: response.data.data || response.data,
    })
  } catch (error: any) {
    yield put({
      type: TYPES.CREATE_VACANCY_ERROR,
      payload: error.response?.data?.message || error.message,
    })
  }
}
