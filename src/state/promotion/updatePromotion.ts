import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { updatePromotionApi } from '../../services/api/promotionService'
import { HTTP_CODE } from '../../lib/enums/httpData'

export const updatePromotion = (id: string, data: any) => ({ type: TYPES.UPDATE_PROMOTION, payload: { id, data } })

const updatePromotionSuccess = (payload: any) => ({ type: TYPES.UPDATE_PROMOTION_SUCCESS, payload })
const updatePromotionError = (payload: any) => ({ type: TYPES.UPDATE_PROMOTION_ERROR, payload })

export function* updatePromotionSaga(action: { payload: { id: string; data: any } }): Generator<any, void, any> {
  try {
    const { id, data } = action.payload
    const response: any = yield call(updatePromotionApi, id, data)
    if (response.status === HTTP_CODE.OK) {
      const payload = response.data?.data ?? response.data ?? {}
      yield put(updatePromotionSuccess(payload))
    } else {
      yield put(updatePromotionError(response))
    }
  } catch (err: any) {
    const msg = err?.errorMessage || err?.response?.data?.message || err?.message || 'Failed to update promotion'
    yield put(updatePromotionError(msg))
  }
}
