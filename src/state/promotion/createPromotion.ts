import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { createPromotionApi } from '../../services/api/promotionService'
import { HTTP_CODE } from '../../lib/enums/httpData'

export const createPromotion = (payload: any) => ({ type: TYPES.CREATE_PROMOTION, payload })

const createPromotionSuccess = (payload: any) => ({ type: TYPES.CREATE_PROMOTION_SUCCESS, payload })
const createPromotionError = (payload: any) => ({ type: TYPES.CREATE_PROMOTION_ERROR, payload })

export function* createPromotionSaga(action: { payload: any }): Generator<any, void, any> {
  try {
    const response: any = yield call(createPromotionApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      const payload = response.data?.data ?? response.data ?? {}
      yield put(createPromotionSuccess(payload))
    } else {
      yield put(createPromotionError(response))
    }
  } catch (err: any) {
    const msg = err?.errorMessage || err?.response?.data?.message || err?.message || 'Failed to create promotion'
    yield put(createPromotionError(msg))
  }
}
