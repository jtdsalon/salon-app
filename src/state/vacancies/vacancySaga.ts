import { takeEvery } from 'redux-saga/effects'
import * as TYPES from './types'
import { getVacanciesSaga } from './getVacancies'
import { getVacancyByIdSaga } from './getVacancyById'
import { createVacancySaga } from './createVacancy'
import { updateVacancySaga } from './updateVacancy'
import { deleteVacancySaga } from './deleteVacancy'

export function* vacancySaga() {
  yield takeEvery(TYPES.GET_VACANCIES, getVacanciesSaga)
  yield takeEvery(TYPES.GET_VACANCY_BY_ID, getVacancyByIdSaga)
  yield takeEvery(TYPES.CREATE_VACANCY, createVacancySaga)
  yield takeEvery(TYPES.UPDATE_VACANCY, updateVacancySaga)
  yield takeEvery(TYPES.DELETE_VACANCY, deleteVacancySaga)
}
