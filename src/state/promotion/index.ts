export * from './types'
export { promotionReducer } from './reducer'
export { getPromotions } from './getPromotions'
export { getPromotionById } from './getPromotionById'
export { createPromotion } from './createPromotion'
export { updatePromotion } from './updatePromotion'
export { deletePromotion } from './deletePromotion'
export { promotionSaga } from './promotionSaga'
export { usePromotion } from './usePromotion'

export const clearPromotionSuccess = () => ({ type: 'CLEAR_PROMOTION_SUCCESS' as const })
export const clearPromotionError = () => ({ type: 'CLEAR_PROMOTION_ERROR' as const })
