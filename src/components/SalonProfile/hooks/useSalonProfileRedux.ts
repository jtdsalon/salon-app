import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../state/store'
import { updateSalonProfile, updateOperatingHours, clearSuccess } from '../../../state/salon'
import type { Salon, OperatingHour } from '../../../state/salon'

export const useSalonProfileRedux = () => {
  const dispatch = useDispatch()
  
  const salon = useSelector((state: RootState) => state.salon.salon)
  const updating = useSelector((state: RootState) => state.salon.updating)
  const updatingHours = useSelector((state: RootState) => state.salon.updatingHours)
  const updateError = useSelector((state: RootState) => state.salon.updateError)
  const success = useSelector((state: RootState) => state.salon.success)

  // Update profile
  const handleUpdateProfile = useCallback(
    (salonId: string, profileData: Partial<Salon>) => {
      dispatch(updateSalonProfile(salonId, profileData) as any)
    },
    [dispatch]
  )

  // Update operating hours
  const handleUpdateOperatingHours = useCallback(
    (salonId: string, operatingHours: OperatingHour[]) => {
      dispatch(updateOperatingHours(salonId, operatingHours) as any)
    },
    [dispatch]
  )

  // Clear success message
  const handleClearSuccess = useCallback(() => {
    dispatch(clearSuccess())
  }, [dispatch])

  // Clear error
  const clearError = useCallback(() => {
    // Dispatch a clear error action if needed, or use a reducer action
    // For now, errors clear when component unmounts or new action is dispatched
  }, [])

  return {
    salon,
    updating: updating || updatingHours,
    updateError,
    success,
    handleUpdateProfile,
    handleUpdateOperatingHours,
    handleClearSuccess,
    clearError,
  }
}
