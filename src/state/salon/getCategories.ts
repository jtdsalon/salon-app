import { put } from 'redux-saga/effects'
import * as TYPES from './types'
import { HTTP_CODE } from '../../lib/enums/httpData'

// Action creator
export const getCategories = () => ({
  type: TYPES.GET_CATEGORIES,
})

const getCategoriesSuccess = (payload: string[]) => ({ type: TYPES.GET_CATEGORIES_SUCCESS, payload })
const getCategoriesError = (payload: any) => ({ type: TYPES.GET_CATEGORIES_ERROR, payload })

// Default fallback categories
const FALLBACK_CATEGORIES = ['Hair Salon', 'Spa', 'Nail Studio', 'Beauty Center', 'Wellness', 'Other']

// Saga - Return predefined categories
export function* getCategoriesSaga(): Generator<any, void, any> {
  try {
    // Use predefined categories instead of fetching from API
    yield put(getCategoriesSuccess(FALLBACK_CATEGORIES))
  } catch (err) {
    console.error('Failed to set categories:', err)
    // Use fallback on error
    yield put(getCategoriesSuccess(FALLBACK_CATEGORIES))
  }
}
