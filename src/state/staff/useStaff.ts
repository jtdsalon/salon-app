import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import * as staffActions from './index'
import type { Staff } from './types'

export const useStaff = () => {
  const dispatch = useDispatch()

  // Select staff state from Redux
  const staffState = useSelector((state: RootState) => state.staff)

  // Memoized action dispatchers
  const handleGetStaff = useCallback(
    (salonId: string) => {
      dispatch(staffActions.getStaff(salonId))
    },
    [dispatch]
  )

  const handleGetStaffById = useCallback(
    (staffId: string) => {
      dispatch(staffActions.getStaffById(staffId))
    },
    [dispatch]
  )

  const handleCreateStaff = useCallback(
    (staffData: Partial<Staff>) => {
      dispatch(staffActions.createStaff(staffData))
    },
    [dispatch]
  )

  const handleUpdateStaff = useCallback(
    (staffId: string, staffData: Partial<Staff>) => {
      dispatch(staffActions.updateStaff(staffId, staffData))
    },
    [dispatch]
  )

  const handleDeleteStaff = useCallback(
    (staffId: string) => {
      dispatch(staffActions.deleteStaff(staffId))
    },
    [dispatch]
  )

  const handleClearSuccess = useCallback(() => {
    dispatch(staffActions.clearSuccess())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(staffActions.clearError())
  }, [dispatch])

  return {
    // State
    staffList: staffState.staffList,
    currentStaff: staffState.currentStaff,
    loading: staffState.loading,
    itemLoading: staffState.itemLoading,
    creating: staffState.creating,
    updating: staffState.updating,
    deleting: staffState.deleting,
    error: staffState.error,
    success: staffState.success,
    successMessage: staffState.successMessage,

    // Actions
    handleGetStaff,
    handleGetStaffById,
    handleCreateStaff,
    handleUpdateStaff,
    handleDeleteStaff,
    handleClearSuccess,
    handleClearError,
  }
}
