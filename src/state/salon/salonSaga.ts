import { takeEvery } from 'redux-saga/effects'
import { GET_SALON, CREATE_SALON, GET_CATEGORIES, UPDATE_SALON_PROFILE, UPDATE_OPERATING_HOURS } from './types'
import { getSalonSaga } from './getSalon'
import { createSalonSaga } from './createSalon'
import { getCategoriesSaga } from './getCategories'
import { updateSalonProfileSaga, updateOperatingHoursSaga } from './updateProfile'

export function* salonSaga() {
  yield takeEvery(GET_SALON, getSalonSaga)
  yield takeEvery(CREATE_SALON, createSalonSaga)
  yield takeEvery(GET_CATEGORIES, getCategoriesSaga)
  yield takeEvery(UPDATE_SALON_PROFILE, updateSalonProfileSaga)
  yield takeEvery(UPDATE_OPERATING_HOURS, updateOperatingHoursSaga)
}
