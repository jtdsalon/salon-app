import { put, call } from 'redux-saga/effects'
import * as TYPES from './types'
import { getVacanciesApi } from '../../services/api/vacancyService'

export function* getVacanciesSaga(action: { type: string; payload: string }) {
  try {
    const response = yield call(getVacanciesApi, action.payload)
    yield put({
      type: TYPES.GET_VACANCIES_SUCCESS,
      payload: response.data.data || response.data,
    })
  } catch (error: any) {
    yield put({
      type: TYPES.GET_VACANCIES_ERROR,
      payload: error.response?.data?.message || error.message,
    })
  }
}
