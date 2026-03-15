import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { createSalonApi } from '../../services/api/salonService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const createSalon = (salonData: any) => ({ type: TYPES.CREATE_SALON, payload: salonData })

const createSalonSuccess = (payload: any) => ({ type: TYPES.CREATE_SALON_SUCCESS, payload })
const createSalonError = (payload: any) => ({ type: TYPES.CREATE_SALON_ERROR, payload })

// Saga
export function* createSalonSaga(action: { payload: any }): Generator<any, void, any> {
  try {
    const response: any = yield call(createSalonApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      let payload = response.data?.data || response.data || {}
      
      // Transform API field names to match component expectations
      // Map image_url -> avatar and cover_image_url -> cover
      if (payload.image_url && !payload.avatar) {
        payload.avatar = payload.image_url
      }
      if (payload.cover_image_url && !payload.cover) {
        payload.cover = payload.cover_image_url
      }
      
      yield put(createSalonSuccess(payload))
    } else {
      yield put(createSalonError(response))
    }
  } catch (err) {
    yield put(createSalonError(err))
  }
}
