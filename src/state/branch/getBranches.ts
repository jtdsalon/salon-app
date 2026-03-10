import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getBranchesApi } from '../../services/api/branchService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const getBranches = (salonId: string) => ({ type: TYPES.GET_BRANCHES, payload: salonId })

const getBranchesSuccess = (payload: any) => ({ type: TYPES.GET_BRANCHES_SUCCESS, payload })
const getBranchesError = (payload: any) => ({ type: TYPES.GET_BRANCHES_ERROR, payload })

// Saga
export function* getBranchesSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(getBranchesApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data || response.data || []
      yield put(getBranchesSuccess(payload))
    } else {
      yield put(getBranchesError(response))
    }
  } catch (err) {
    yield put(getBranchesError(err))
  }
}
