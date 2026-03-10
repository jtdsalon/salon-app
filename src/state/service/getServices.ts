import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getServicesApi } from '../../services/api/serviceService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const getServices = (salonId: string) => ({ type: TYPES.GET_SERVICES, payload: salonId })

const getServicesSuccess = (payload: any) => ({ type: TYPES.GET_SERVICES_SUCCESS, payload })
const getServicesError = (payload: any) => ({ type: TYPES.GET_SERVICES_ERROR, payload })

// Saga
export function* getServicesSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(getServicesApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || []
      yield put(getServicesSuccess(payload))
    } else {
      yield put(getServicesError(response))
    }
  } catch (err) {
    yield put(getServicesError(err))
  }
}
