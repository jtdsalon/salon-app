import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { updateStaffApi } from '../../services/api/staffService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const updateStaff = (staffId: string, staffData: any) => ({
  type: TYPES.UPDATE_STAFF,
  payload: { id: staffId, data: staffData },
})

const updateStaffSuccess = (payload: any) => ({ type: TYPES.UPDATE_STAFF_SUCCESS, payload })
const updateStaffError = (payload: any) => ({ type: TYPES.UPDATE_STAFF_ERROR, payload })

// Saga
export function* updateStaffSaga(action: { payload: { id: string; data: any } }): Generator<any, void, any> {
  try {
    const { id, data } = action.payload
    const response: any = yield call(updateStaffApi, id, data)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || {}
      yield put(updateStaffSuccess(payload))
    } else {
      yield put(updateStaffError(response))
    }
  } catch (err) {
    yield put(updateStaffError(err))
  }
}
