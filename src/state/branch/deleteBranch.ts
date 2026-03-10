import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { deleteBranchApi } from '../../services/api/branchService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const deleteBranch = (payload: any) => ({ type: TYPES.DELETE_BRANCH, payload })

const deleteBranchSuccess = (payload: any) => ({ type: TYPES.DELETE_BRANCH_SUCCESS, payload })
const deleteBranchError = (payload: any) => ({ type: TYPES.DELETE_BRANCH_ERROR, payload })

// Saga
export function* deleteBranchSaga(action: { payload: any }): Generator<any, void, any> {
  try {
    const response: any = yield call(deleteBranchApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.NO_CONTENT) {
      yield put(deleteBranchSuccess(action.payload))
    } else {
      yield put(deleteBranchError(response))
    }
  } catch (err) {
    yield put(deleteBranchError(err))
  }
}
