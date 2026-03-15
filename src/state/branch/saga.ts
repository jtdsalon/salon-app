import { takeEvery } from 'redux-saga/effects'
import { GET_BRANCHES, GET_BRANCH_BY_ID, CREATE_BRANCH, UPDATE_BRANCH, DELETE_BRANCH } from './types'
import { getBranchesSaga } from './getBranches'
import { getBranchByIdSaga } from './getBranchById'
import { createBranchSaga } from './createBranch'
import { updateBranchSaga } from './updateBranch'
import { deleteBranchSaga } from './deleteBranch'

export function* branchSaga() {
  yield takeEvery(GET_BRANCHES, getBranchesSaga)
  yield takeEvery(GET_BRANCH_BY_ID, getBranchByIdSaga)
  yield takeEvery(CREATE_BRANCH, createBranchSaga)
  yield takeEvery(UPDATE_BRANCH, updateBranchSaga)
  yield takeEvery(DELETE_BRANCH, deleteBranchSaga)
}
