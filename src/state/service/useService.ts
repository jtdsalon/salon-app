import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import * as serviceActions from './index'
import type { Service } from './types'

export const useService = () => {
  const dispatch = useDispatch()

  // Select service state from Redux
  const serviceState = useSelector((state: RootState) => state.service)

  // Memoized action dispatchers
  const handleGetServices = useCallback(
    (salonId: string) => {
      dispatch(serviceActions.getServices(salonId))
    },
    [dispatch]
  )

  const handleCreateService = useCallback(
    (serviceData: Partial<Service>) => {
      dispatch(serviceActions.createService(serviceData))
    },
    [dispatch]
  )

  const handleUpdateService = useCallback(
    (serviceId: string, serviceData: Partial<Service>) => {
      dispatch(serviceActions.updateService(serviceId, serviceData))
    },
    [dispatch]
  )

  const handleDeleteService = useCallback(
    (serviceId: string) => {
      dispatch(serviceActions.deleteService(serviceId))
    },
    [dispatch]
  )

  const handleClearSuccess = useCallback(() => {
    dispatch(serviceActions.clearSuccess())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(serviceActions.clearError())
  }, [dispatch])

  return {
    // State
    serviceList: serviceState.serviceList,
    currentService: serviceState.currentService,
    loading: serviceState.loading,
    itemLoading: serviceState.itemLoading,
    creating: serviceState.creating,
    updating: serviceState.updating,
    deleting: serviceState.deleting,
    error: serviceState.error,
    success: serviceState.success,
    successMessage: serviceState.successMessage,

    // Actions
    handleGetServices,
    handleCreateService,
    handleUpdateService,
    handleDeleteService,
    handleClearSuccess,
    handleClearError,
  }
}
