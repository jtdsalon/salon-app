import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getPromotionsBySalonApi } from '../../services/api/promotionService'
import { HTTP_CODE } from '../../lib/enums/httpData'

export const getPromotions = (salonId: string, params?: { status?: string; type?: string; page?: number; limit?: number }) =>
  ({ type: TYPES.GET_PROMOTIONS, payload: { salonId, params } })

const getPromotionsSuccess = (payload: any) => ({ type: TYPES.GET_PROMOTIONS_SUCCESS, payload })
const getPromotionsError = (payload: any) => ({ type: TYPES.GET_PROMOTIONS_ERROR, payload })

export function* getPromotionsSaga(action: { payload: { salonId: string; params?: any } }): Generator<any, void, any> {
  try {
    const { salonId, params } = action.payload
    const response: any = yield call(getPromotionsBySalonApi, salonId, params)
    if (response.status === HTTP_CODE.OK) {
      const data = response.data?.data ?? response.data ?? []
      const list = Array.isArray(data) ? data : []
      yield put(getPromotionsSuccess(list))
    } else {
      yield put(getPromotionsError(response))
    }
  } catch (err: any) {
    const msg = err?.errorMessage || err?.response?.data?.message || err?.message || 'Failed to load promotions'
    yield put(getPromotionsError(msg))
  }
}
