import type { Promotion } from '../../services/api/promotionService'

// Action Types
export const GET_PROMOTIONS = 'GET_PROMOTIONS' as const
export const GET_PROMOTIONS_SUCCESS = 'GET_PROMOTIONS_SUCCESS' as const
export const GET_PROMOTIONS_ERROR = 'GET_PROMOTIONS_ERROR' as const

export const GET_PROMOTION_BY_ID = 'GET_PROMOTION_BY_ID' as const
export const GET_PROMOTION_BY_ID_SUCCESS = 'GET_PROMOTION_BY_ID_SUCCESS' as const
export const GET_PROMOTION_BY_ID_ERROR = 'GET_PROMOTION_BY_ID_ERROR' as const

export const CREATE_PROMOTION = 'CREATE_PROMOTION' as const
export const CREATE_PROMOTION_SUCCESS = 'CREATE_PROMOTION_SUCCESS' as const
export const CREATE_PROMOTION_ERROR = 'CREATE_PROMOTION_ERROR' as const

export const UPDATE_PROMOTION = 'UPDATE_PROMOTION' as const
export const UPDATE_PROMOTION_SUCCESS = 'UPDATE_PROMOTION_SUCCESS' as const
export const UPDATE_PROMOTION_ERROR = 'UPDATE_PROMOTION_ERROR' as const

export const DELETE_PROMOTION = 'DELETE_PROMOTION' as const
export const DELETE_PROMOTION_SUCCESS = 'DELETE_PROMOTION_SUCCESS' as const
export const DELETE_PROMOTION_ERROR = 'DELETE_PROMOTION_ERROR' as const

export const CLEAR_PROMOTION_SUCCESS = 'CLEAR_PROMOTION_SUCCESS' as const
export const CLEAR_PROMOTION_ERROR = 'CLEAR_PROMOTION_ERROR' as const

export interface PromotionState {
  promotionList: Promotion[]
  currentPromotion: Promotion | null
  loading: boolean
  itemLoading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  error: any
  success: boolean
  successMessage: string
}

export const INITIAL_STATE: PromotionState = {
  promotionList: [],
  currentPromotion: null,
  loading: false,
  itemLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: false,
  successMessage: '',
}

export type PromotionAction =
  | { type: typeof GET_PROMOTIONS; payload: { salonId: string; params?: any } }
  | { type: typeof GET_PROMOTIONS_SUCCESS; payload: Promotion[] }
  | { type: typeof GET_PROMOTIONS_ERROR; payload: any }
  | { type: typeof GET_PROMOTION_BY_ID; payload: string }
  | { type: typeof GET_PROMOTION_BY_ID_SUCCESS; payload: Promotion }
  | { type: typeof GET_PROMOTION_BY_ID_ERROR; payload: any }
  | { type: typeof CREATE_PROMOTION; payload: any }
  | { type: typeof CREATE_PROMOTION_SUCCESS; payload: Promotion }
  | { type: typeof CREATE_PROMOTION_ERROR; payload: any }
  | { type: typeof UPDATE_PROMOTION; payload: { id: string; data: any } }
  | { type: typeof UPDATE_PROMOTION_SUCCESS; payload: Promotion }
  | { type: typeof UPDATE_PROMOTION_ERROR; payload: any }
  | { type: typeof DELETE_PROMOTION; payload: string }
  | { type: typeof DELETE_PROMOTION_SUCCESS; payload: string }
  | { type: typeof DELETE_PROMOTION_ERROR; payload: any }
  | { type: typeof CLEAR_PROMOTION_SUCCESS }
  | { type: typeof CLEAR_PROMOTION_ERROR }
