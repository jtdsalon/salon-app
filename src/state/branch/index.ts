// Export action creators
export { getBranches } from './getBranches'
export { getBranchById } from './getBranchById'
export { createBranch } from './createBranch'
export { updateBranch } from './updateBranch'
export { deleteBranch } from './deleteBranch'

// Export sagas
export { getBranchesSaga } from './getBranches'
export { getBranchByIdSaga } from './getBranchById'
export { createBranchSaga } from './createBranch'
export { updateBranchSaga } from './updateBranch'
export { deleteBranchSaga } from './deleteBranch'
export { branchSaga } from './saga'

// Export reducer
export { branchReducer } from './reducer'

// Export types
export type { Branch, BranchState, BranchAction } from './types'

// Export action type constants
export * as BRANCH_TYPES from './types'

// Action type constants for success/error clearing
export const clearSuccess = () => ({ type: 'CLEAR_SUCCESS' })
export const clearError = () => ({ type: 'CLEAR_ERROR' })
