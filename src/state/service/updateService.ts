import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { updateServiceApi } from '../../services/api/serviceService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const updateService = (serviceId: string, serviceData: any) => ({
  type: TYPES.UPDATE_SERVICE,
  payload: { id: serviceId, data: serviceData },
})

const updateServiceSuccess = (payload: any) => ({ type: TYPES.UPDATE_SERVICE_SUCCESS, payload })
const updateServiceError = (payload: any) => ({ type: TYPES.UPDATE_SERVICE_ERROR, payload })

// Saga
export function* updateServiceSaga(action: { payload: { id: string; data: any } }): Generator<any, void, any> {
  try {
    const { id, data } = action.payload
    const response: any = yield call(updateServiceApi, id, data)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || {}
      yield put(updateServiceSuccess(payload))
    } else {
      yield put(updateServiceError(response))
    }
  } catch (err) {
    yield put(updateServiceError(err))
  }
}
