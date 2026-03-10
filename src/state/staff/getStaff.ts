import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getStaffApi } from '../../services/api/staffService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const getStaff = (salonId: string) => ({ type: TYPES.GET_STAFF, payload: salonId })

const getStaffSuccess = (payload: any) => ({ type: TYPES.GET_STAFF_SUCCESS, payload })
const getStaffError = (payload: any) => ({ type: TYPES.GET_STAFF_ERROR, payload })

// Saga
export function* getStaffSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(getStaffApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || []
      yield put(getStaffSuccess(payload))
    } else {
      yield put(getStaffError(response))
    }
  } catch (err) {
    yield put(getStaffError(err))
  }
}
