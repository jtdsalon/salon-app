import { put, call } from 'redux-saga/effects'
import * as TYPES from './types'
import { getVacancyByIdApi } from '../../services/api/vacancyService'

export function* getVacancyByIdSaga(action: { type: string; payload: string }) {
  try {
    const response = yield call(getVacancyByIdApi, action.payload)
    yield put({
      type: TYPES.GET_VACANCY_BY_ID_SUCCESS,
      payload: response.data.data || response.data,
    })
  } catch (error: any) {
    yield put({
      type: TYPES.GET_VACANCY_BY_ID_ERROR,
      payload: error.response?.data?.message || error.message,
    })
  }
}
