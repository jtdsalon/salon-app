import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { getBranches } from './getBranches'
import { getBranchById } from './getBranchById'
import { createBranch } from './createBranch'
import { updateBranch } from './updateBranch'
import { deleteBranch } from './deleteBranch'
import { clearSuccess, clearError } from './index'
import type { Branch } from './types'

export const useBranch = () => {
  const dispatch = useDispatch()

  // Select branch state from Redux
  const branchState = useSelector((state: RootState) => state.branch)

  // Memoized action dispatchers
  const handleGetBranches = useCallback(
    (salonId: string) => {
      dispatch(getBranches(salonId))
    },
    [dispatch]
  )

  const handleGetBranchById = useCallback(
    (branchId: string) => {
      dispatch(getBranchById(branchId))
    },
    [dispatch]
  )

  const handleCreateBranch = useCallback(
    (branchData: Partial<Branch>) => {
      dispatch(createBranch(branchData))
    },
    [dispatch]
  )

  const handleUpdateBranch = useCallback(
    (branchId: string, branchData: Partial<Branch>) => {
      dispatch(updateBranch(branchId, branchData))
    },
    [dispatch]
  )

  const handleDeleteBranch = useCallback(
    (branchId: string) => {
      dispatch(deleteBranch(branchId))
    },
    [dispatch]
  )

  const handleClearSuccess = useCallback(() => {
    dispatch(clearSuccess())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    // State
    branchList: branchState?.branchList || [],
    currentBranch: branchState?.currentBranch || null,
    loading: branchState?.loading || false,
    itemLoading: branchState?.itemLoading || false,
    creating: branchState?.creating || false,
    updating: branchState?.updating || false,
    deleting: branchState?.deleting || false,
    error: branchState?.error || null,
    success: branchState?.success || false,
    successMessage: branchState?.successMessage || '',

    // Actions
    handleGetBranches,
    handleGetBranchById,
    handleCreateBranch,
    handleUpdateBranch,
    handleDeleteBranch,
    handleClearSuccess,
    handleClearError,
  }
}
