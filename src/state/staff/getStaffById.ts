import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getStaffByIdApi } from '../../services/api/staffService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const getStaffById = (staffId: string) => ({ type: TYPES.GET_STAFF_BY_ID, payload: staffId })

const getStaffByIdSuccess = (payload: any) => ({ type: TYPES.GET_STAFF_BY_ID_SUCCESS, payload })
const getStaffByIdError = (payload: any) => ({ type: TYPES.GET_STAFF_BY_ID_ERROR, payload })

// Saga
export function* getStaffByIdSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(getStaffByIdApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || {}
      yield put(getStaffByIdSuccess(payload))
    } else {
      yield put(getStaffByIdError(response))
    }
  } catch (err) {
    yield put(getStaffByIdError(err))
  }
}
