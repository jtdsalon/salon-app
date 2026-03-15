import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { deleteServiceApi } from '../../services/api/serviceService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const deleteService = (serviceId: string) => ({ type: TYPES.DELETE_SERVICE, payload: serviceId })

const deleteServiceSuccess = (payload: string) => ({ type: TYPES.DELETE_SERVICE_SUCCESS, payload })
const deleteServiceError = (payload: any) => ({ type: TYPES.DELETE_SERVICE_ERROR, payload })

// Saga
export function* deleteServiceSaga(action: { payload: string }): Generator<any, void, any> {
  const serviceId = action.payload
  try {
    const response: any = yield call(deleteServiceApi, serviceId)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED || response.status === HTTP_CODE.NO_CONTENT) {
      yield put(deleteServiceSuccess(serviceId))
    } else {
      yield put(deleteServiceError(response))
    }
  } catch (err) {
    yield put(deleteServiceError(err))
  }
}
