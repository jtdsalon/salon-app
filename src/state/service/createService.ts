import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { createServiceApi } from '../../services/api/serviceService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const createService = (serviceData: any) => ({ type: TYPES.CREATE_SERVICE, payload: serviceData })

const createServiceSuccess = (payload: any) => ({ type: TYPES.CREATE_SERVICE_SUCCESS, payload })
const createServiceError = (payload: any) => ({ type: TYPES.CREATE_SERVICE_ERROR, payload })

// Saga
export function* createServiceSaga(action: { payload: any }): Generator<any, void, any> {
  try {
    const response: any = yield call(createServiceApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || {}
      yield put(createServiceSuccess(payload))
    } else {
      yield put(createServiceError(response))
    }
  } catch (err) {
    yield put(createServiceError(err))
  }
}
