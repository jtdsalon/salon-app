import { takeEvery } from 'redux-saga/effects'
import * as TYPES from './types'
import { getStaffSaga } from './getStaff'
import { getStaffByIdSaga } from './getStaffById'
import { createStaffSaga } from './createStaff'
import { updateStaffSaga } from './updateStaff'
import { deleteStaffSaga } from './deleteStaff'

export function* staffSaga() {
  yield takeEvery(TYPES.GET_STAFF, getStaffSaga)
  yield takeEvery(TYPES.GET_STAFF_BY_ID, getStaffByIdSaga)
  yield takeEvery(TYPES.CREATE_STAFF, createStaffSaga)
  yield takeEvery(TYPES.UPDATE_STAFF, updateStaffSaga)
  yield takeEvery(TYPES.DELETE_STAFF, deleteStaffSaga)
}
