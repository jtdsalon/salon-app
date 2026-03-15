import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getPromotionByIdApi } from '../../services/api/promotionService'
import { HTTP_CODE } from '../../lib/enums/httpData'

export const getPromotionById = (id: string) => ({ type: TYPES.GET_PROMOTION_BY_ID, payload: id })

const getPromotionByIdSuccess = (payload: any) => ({ type: TYPES.GET_PROMOTION_BY_ID_SUCCESS, payload })
const getPromotionByIdError = (payload: any) => ({ type: TYPES.GET_PROMOTION_BY_ID_ERROR, payload })

export function* getPromotionByIdSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(getPromotionByIdApi, action.payload)
    if (response.status === HTTP_CODE.OK) {
      const payload = response.data?.data ?? response.data ?? null
      yield put(getPromotionByIdSuccess(payload))
    } else {
      yield put(getPromotionByIdError(response))
    }
  } catch (err: any) {
    const msg = err?.errorMessage || err?.response?.data?.message || err?.message || 'Failed to load promotion'
    yield put(getPromotionByIdError(msg))
  }
}
