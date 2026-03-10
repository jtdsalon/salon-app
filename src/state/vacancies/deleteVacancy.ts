import { put, call } from 'redux-saga/effects'
import * as TYPES from './types'
import { deleteVacancyApi } from '../../services/api/vacancyService'

export function* deleteVacancySaga(action: { type: string; payload: string }) {
  try {
    yield call(deleteVacancyApi, action.payload)
    yield put({
      type: TYPES.DELETE_VACANCY_SUCCESS,
      payload: action.payload,
    })
  } catch (error: any) {
    yield put({
      type: TYPES.DELETE_VACANCY_ERROR,
      payload: error.response?.data?.message || error.message,
    })
  }
}
