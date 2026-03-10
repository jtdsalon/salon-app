import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getBranchByIdApi } from '../../services/api/branchService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const getBranchById = (branchId: string) => ({ type: TYPES.GET_BRANCH_BY_ID, payload: branchId })

const getBranchByIdSuccess = (payload: any) => ({ type: TYPES.GET_BRANCH_BY_ID_SUCCESS, payload })
const getBranchByIdError = (payload: any) => ({ type: TYPES.GET_BRANCH_BY_ID_ERROR, payload })

// Saga
export function* getBranchByIdSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(getBranchByIdApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data
      yield put(getBranchByIdSuccess(payload))
    } else {
      yield put(getBranchByIdError(response))
    }
  } catch (err) {
    yield put(getBranchByIdError(err))
  }
}
