import { takeEvery } from 'redux-saga/effects'
import * as TYPES from './types'
import { getPromotionsSaga } from './getPromotions'
import { getPromotionByIdSaga } from './getPromotionById'
import { createPromotionSaga } from './createPromotion'
import { updatePromotionSaga } from './updatePromotion'
import { deletePromotionSaga } from './deletePromotion'

export function* promotionSaga() {
  yield takeEvery(TYPES.GET_PROMOTIONS, getPromotionsSaga as any)
  yield takeEvery(TYPES.GET_PROMOTION_BY_ID, getPromotionByIdSaga as any)
  yield takeEvery(TYPES.CREATE_PROMOTION, createPromotionSaga as any)
  yield takeEvery(TYPES.UPDATE_PROMOTION, updatePromotionSaga as any)
  yield takeEvery(TYPES.DELETE_PROMOTION, deletePromotionSaga as any)
}
