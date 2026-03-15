import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { deletePromotionApi } from '../../services/api/promotionService'
import { HTTP_CODE } from '../../lib/enums/httpData'

export const deletePromotion = (id: string) => ({ type: TYPES.DELETE_PROMOTION, payload: id })

const deletePromotionSuccess = (payload: string) => ({ type: TYPES.DELETE_PROMOTION_SUCCESS, payload })
const deletePromotionError = (payload: any) => ({ type: TYPES.DELETE_PROMOTION_ERROR, payload })

export function* deletePromotionSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(deletePromotionApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.NO_CONTENT) {
      yield put(deletePromotionSuccess(action.payload))
    } else {
      yield put(deletePromotionError(response))
    }
  } catch (err: any) {
    const msg = err?.errorMessage || err?.response?.data?.message || err?.message || 'Failed to delete promotion'
    yield put(deletePromotionError(msg))
  }
}
