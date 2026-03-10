import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { updateBranchApi } from '../../services/api/branchService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const updateBranch = (id: string, data: any) => ({ type: TYPES.UPDATE_BRANCH, payload: { id, data } })

const updateBranchSuccess = (payload: any) => ({ type: TYPES.UPDATE_BRANCH_SUCCESS, payload })
const updateBranchError = (payload: any) => ({ type: TYPES.UPDATE_BRANCH_ERROR, payload })

// Saga
export function* updateBranchSaga(action: { payload: { id: string; data: any } }): Generator<any, void, any> {
  try {
    const { id, data } = action.payload
    const response: any = yield call(updateBranchApi, id, data)
    if (response.status === HTTP_CODE.OK) {
      const payload = response.data?.data || response.data
      yield put(updateBranchSuccess(payload))
    } else {
      yield put(updateBranchError(response))
    }
  } catch (err) {
    yield put(updateBranchError(err))
  }
}
