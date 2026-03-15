import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { createBranchApi } from '../../services/api/branchService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const createBranch = (payload: any) => ({ type: TYPES.CREATE_BRANCH, payload })

const createBranchSuccess = (payload: any) => ({ type: TYPES.CREATE_BRANCH_SUCCESS, payload })
const createBranchError = (payload: any) => ({ type: TYPES.CREATE_BRANCH_ERROR, payload })

// Saga
export function* createBranchSaga(action: { payload: any }): Generator<any, void, any> {
  try {
    const response: any = yield call(createBranchApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data
      yield put(createBranchSuccess(payload))
    } else {
      yield put(createBranchError(response))
    }
  } catch (err) {
    yield put(createBranchError(err))
  }
}
