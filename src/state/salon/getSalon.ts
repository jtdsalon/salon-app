import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { getSalonApi } from '../../services/api/salonService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const getSalon = (salonId: string) => ({ type: TYPES.GET_SALON, payload: salonId })

const getSalonSuccess = (payload: any) => ({ type: TYPES.GET_SALON_SUCCESS, payload })
const getSalonError = (payload: any) => ({ type: TYPES.GET_SALON_ERROR, payload })

// Saga
export function* getSalonSaga(action: { payload: string }): Generator<any, void, any> {
  try {
    const response: any = yield call(getSalonApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      // Backend returns: { success, message, data: {...salon}, timestamp }
      // We need to extract the actual salon data from response.data.data
      let payload = response.data?.data || response.data || {}
      
      // Transform API field names to match component expectations
      // Map image_url -> avatar and cover_image_url -> cover
      if (payload.image_url && !payload.avatar) {
        payload.avatar = payload.image_url
      }
      if (payload.cover_image_url && !payload.cover) {
        payload.cover = payload.cover_image_url
      }
      
      yield put(getSalonSuccess(payload))
    } else {
      yield put(getSalonError(response))
    }
  } catch (err) {
    yield put(getSalonError(err))
  }
}
