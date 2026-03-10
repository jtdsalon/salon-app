import * as TYPES from './types'
import type { PromotionState, PromotionAction } from './types'

export const promotionReducer = (
  state: PromotionState = TYPES.INITIAL_STATE,
  action: PromotionAction
): PromotionState => {
  switch (action.type) {
    case TYPES.GET_PROMOTIONS:
      return { ...state, loading: true, error: null }
    case TYPES.GET_PROMOTIONS_SUCCESS:
      return { ...state, loading: false, promotionList: action.payload, error: null }
    case TYPES.GET_PROMOTIONS_ERROR:
      return { ...state, loading: false, error: action.payload }

    case TYPES.GET_PROMOTION_BY_ID:
      return { ...state, itemLoading: true, error: null }
    case TYPES.GET_PROMOTION_BY_ID_SUCCESS:
      return { ...state, itemLoading: false, currentPromotion: action.payload, error: null }
    case TYPES.GET_PROMOTION_BY_ID_ERROR:
      return { ...state, itemLoading: false, error: action.payload }

    case TYPES.CREATE_PROMOTION:
      return { ...state, creating: true, error: null, success: false }
    case TYPES.CREATE_PROMOTION_SUCCESS:
      return {
        ...state,
        creating: false,
        promotionList: [...state.promotionList, action.payload],
        error: null,
        success: true,
        successMessage: 'Promotion created successfully',
      }
    case TYPES.CREATE_PROMOTION_ERROR:
      return { ...state, creating: false, error: action.payload, success: false }

    case TYPES.UPDATE_PROMOTION:
      return { ...state, updating: true, error: null, success: false }
    case TYPES.UPDATE_PROMOTION_SUCCESS:
      return {
        ...state,
        updating: false,
        promotionList: state.promotionList.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentPromotion: action.payload,
        error: null,
        success: true,
        successMessage: 'Promotion updated successfully',
      }
    case TYPES.UPDATE_PROMOTION_ERROR:
      return { ...state, updating: false, error: action.payload, success: false }

    case TYPES.DELETE_PROMOTION:
      return { ...state, deleting: true, error: null, success: false }
    case TYPES.DELETE_PROMOTION_SUCCESS:
      return {
        ...state,
        deleting: false,
        promotionList: state.promotionList.filter((p) => p.id !== action.payload),
        currentPromotion: null,
        error: null,
        success: true,
        successMessage: 'Promotion deleted successfully',
      }
    case TYPES.DELETE_PROMOTION_ERROR:
      return { ...state, deleting: false, error: action.payload, success: false }

    case TYPES.CLEAR_PROMOTION_SUCCESS:
      return { ...state, success: false, successMessage: '' }
    case TYPES.CLEAR_PROMOTION_ERROR:
      return { ...state, error: null }

    default:
      return state
  }
}
