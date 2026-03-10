import { takeEvery } from 'redux-saga/effects'
import { GET_SERVICES, CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from './types'
import { getServicesSaga } from './getServices'
import { createServiceSaga } from './createService'
import { updateServiceSaga } from './updateService'
import { deleteServiceSaga } from './deleteService'

export function* serviceSaga() {
  yield takeEvery(GET_SERVICES, getServicesSaga)
  yield takeEvery(CREATE_SERVICE, createServiceSaga)
  yield takeEvery(UPDATE_SERVICE, updateServiceSaga)
  yield takeEvery(DELETE_SERVICE, deleteServiceSaga)
}
