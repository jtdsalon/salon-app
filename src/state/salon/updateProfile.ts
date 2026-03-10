import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { updateSalonProfileApi, updateOperatingHoursApi } from '../../services/api/salonService'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creators
export const updateSalonProfile = (salonId: string, profileData: Partial<TYPES.Salon>) => ({
  type: TYPES.UPDATE_SALON_PROFILE,
  payload: { salonId, profileData },
})

export const updateOperatingHours = (salonId: string, operatingHours: TYPES.OperatingHour[]) => ({
  type: TYPES.UPDATE_OPERATING_HOURS,
  payload: { salonId, operatingHours },
})

const updateSalonProfileSuccess = (payload: TYPES.Salon) => ({
  type: TYPES.UPDATE_SALON_PROFILE_SUCCESS,
  payload,
})

const updateSalonProfileError = (payload: any) => ({
  type: TYPES.UPDATE_SALON_PROFILE_ERROR,
  payload,
})

const updateOperatingHoursSuccess = (payload: TYPES.OperatingHour[]) => ({
  type: TYPES.UPDATE_OPERATING_HOURS_SUCCESS,
  payload,
})

const updateOperatingHoursError = (payload: any) => ({
  type: TYPES.UPDATE_OPERATING_HOURS_ERROR,
  payload,
})

// Saga for updating profile
export function* updateSalonProfileSaga(action: {
  payload: { salonId: string; profileData: Partial<TYPES.Salon> }
}): Generator<any, void, any> {
  try {
    const { salonId, profileData } = action.payload
    const response: any = yield call(updateSalonProfileApi, salonId, profileData)

    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      let data = response.data?.data || response.data
      
      // Transform API field names to match component expectations
      // Map image_url -> avatar and cover_image_url -> cover
      if (data.image_url && !data.avatar) {
        data.avatar = data.image_url
      }
      if (data.cover_image_url && !data.cover) {
        data.cover = data.cover_image_url
      }
      
      // Handle handle and bio from meta if they exist
      if (data.meta?.handle && !data.handle) {
        data.handle = data.meta.handle
      }
      if (data.meta?.bio && !data.bio) {
        data.bio = data.meta.bio
      }
      
      yield put(updateSalonProfileSuccess(data))
    } else {
      const backend = response.data
      let friendlyMessage = backend?.message || 'Failed to update profile'

      // Map backend validation structure to a user-friendly message
      if (backend?.code === 'VALIDATION_ERROR' && Array.isArray(backend.errors) && backend.errors.length) {
        const fieldMessages = backend.errors.map((e: any) => {
          const rawField = e.field || 'field'
          const normalizedField =
            rawField === 'avatar'
              ? 'Logo'
              : rawField === 'cover'
              ? 'Cover image'
              : rawField === 'area'
              ? 'Area'
              : rawField.charAt(0).toUpperCase() + rawField.slice(1)
          const cleanMessage = typeof e.message === 'string' ? e.message.replace(/"/g, '') : ''
          return cleanMessage ? `${normalizedField}: ${cleanMessage}` : normalizedField
        })
        friendlyMessage = fieldMessages.join('\n')
      }

      yield put(updateSalonProfileError(friendlyMessage))
    }
  } catch (err: any) {
    // API client interceptor rejects with { code, errorMessage, errors }, not err.response.data
    const backend = err.response?.data ?? err
    const defaultMessage = backend?.message ?? backend?.errorMessage ?? err.message ?? 'Failed to update profile'
    let friendlyMessage = defaultMessage

    if (backend?.code === 'VALIDATION_ERROR' && Array.isArray(backend.errors) && backend.errors.length) {
      const fieldMessages = backend.errors.map((e: any) => {
        const rawField = e.field || 'field'
        const normalizedField =
          rawField === 'avatar'
            ? 'Logo'
            : rawField === 'cover'
            ? 'Cover image'
            : rawField === 'area'
            ? 'Area'
            : rawField.charAt(0).toUpperCase() + rawField.slice(1)
        const cleanMessage = typeof e.message === 'string' ? e.message.replace(/"/g, '') : ''
        return cleanMessage ? `${normalizedField}: ${cleanMessage}` : normalizedField
      })
      friendlyMessage = fieldMessages.join('\n')
    }

    yield put(updateSalonProfileError(friendlyMessage))
  }
}

// Saga for updating operating hours
export function* updateOperatingHoursSaga(action: {
  payload: { salonId: string; operatingHours: TYPES.OperatingHour[] }
}): Generator<any, void, any> {
  try {
    const { salonId, operatingHours } = action.payload
    const response: any = yield call(updateOperatingHoursApi, salonId, operatingHours)

    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      // Extract operating hours from response - handle multiple possible response structures
      // Response structure: { data: { operatingHours: [...] } } or { data: { hours: [...] } }
      let data = response.data?.data?.operatingHours || 
                 response.data?.data?.hours ||
                 response.data?.operatingHours ||
                 response.data?.hours ||
                 operatingHours; // fallback to what we sent
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        data = operatingHours;
      }
      yield put(updateOperatingHoursSuccess(data))
    } else {
      yield put(updateOperatingHoursError(response.data?.message || 'Failed to update operating hours'))
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to update operating hours'
    console.error('Operating hours update error:', errorMessage);
    yield put(updateOperatingHoursError(errorMessage))
  }
}
