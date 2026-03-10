import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import * as promotionActions from './index'

export const usePromotion = () => {
  const dispatch = useDispatch()

  const promotionState = useSelector((state: RootState) => state.promotion)

  const handleGetPromotions = useCallback(
    (salonId: string, params?: { status?: string; type?: string; page?: number; limit?: number }) => {
      dispatch(promotionActions.getPromotions(salonId, params) as any)
    },
    [dispatch]
  )

  const handleGetPromotionById = useCallback(
    (id: string) => {
      dispatch(promotionActions.getPromotionById(id) as any)
    },
    [dispatch]
  )

  const handleCreatePromotion = useCallback(
    (payload: any) => {
      dispatch(promotionActions.createPromotion(payload) as any)
    },
    [dispatch]
  )

  const handleUpdatePromotion = useCallback(
    (id: string, data: any) => {
      dispatch(promotionActions.updatePromotion(id, data) as any)
    },
    [dispatch]
  )

  const handleDeletePromotion = useCallback(
    (id: string) => {
      dispatch(promotionActions.deletePromotion(id) as any)
    },
    [dispatch]
  )

  const handleClearSuccess = useCallback(() => {
    dispatch(promotionActions.clearPromotionSuccess())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(promotionActions.clearPromotionError())
  }, [dispatch])

  return {
    // State
    promotionList: promotionState.promotionList,
    currentPromotion: promotionState.currentPromotion,
    loading: promotionState.loading,
    itemLoading: promotionState.itemLoading,
    creating: promotionState.creating,
    updating: promotionState.updating,
    deleting: promotionState.deleting,
    error: promotionState.error,
    success: promotionState.success,
    successMessage: promotionState.successMessage,

    // Actions
    handleGetPromotions,
    handleGetPromotionById,
    handleCreatePromotion,
    handleUpdatePromotion,
    handleDeletePromotion,
    handleClearSuccess,
    handleClearError,
  }
}
