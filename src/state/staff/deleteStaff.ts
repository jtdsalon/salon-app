import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { deleteStaffApi } from '../../services/api/staffService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const deleteStaff = (staffId: string) => ({ type: TYPES.DELETE_STAFF, payload: staffId })

const deleteStaffSuccess = (payload: string) => ({ type: TYPES.DELETE_STAFF_SUCCESS, payload })
const deleteStaffError = (payload: any) => ({ type: TYPES.DELETE_STAFF_ERROR, payload })

// Saga
export function* deleteStaffSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const staffId = action.payload
    const response: any = yield call(deleteStaffApi, staffId)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      yield put(deleteStaffSuccess(staffId))
    } else {
      yield put(deleteStaffError(response))
    }
  } catch (err) {
    yield put(deleteStaffError(err))
  }
}
