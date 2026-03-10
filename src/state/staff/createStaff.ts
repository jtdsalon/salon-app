import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { createStaffApi } from '../../services/api/staffService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const createStaff = (staffData: any) => ({ type: TYPES.CREATE_STAFF, payload: staffData })

const createStaffSuccess = (payload: any) => ({ type: TYPES.CREATE_STAFF_SUCCESS, payload })
const createStaffError = (payload: any) => ({ type: TYPES.CREATE_STAFF_ERROR, payload })

// Saga
export function* createStaffSaga(action: { payload: any }): Generator<any, void, any> {
  try {
    const response: any = yield call(createStaffApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || {}
      yield put(createStaffSuccess(payload))
    } else {
      yield put(createStaffError(response))
    }
  } catch (err) {
    yield put(createStaffError(err))
  }
}
