import { call, put } from 'redux-saga/effects'
import * as TYPES from './types'
import { addUserApi } from '../../services/api/userService'
import { HTTP_CODE } from '../../lib/enums/httpData'
import type { UserAction, User } from './types'

// Action(s)
export const addUser = (payload: Partial<User>): UserAction => ({
  type: TYPES.ADD_USER,
  payload: payload,
})

const addUserSuccess = (payload: User): UserAction => ({
  type: TYPES.ADD_USER_SUCCESS,
  payload: payload,
})

const addUserError = (error: any): UserAction => ({
  type: TYPES.ADD_USER_ERROR,
  payload: error,
})

// Saga(s)
export function* addUserSaga(action: UserAction & { payload: Partial<User> }): Generator<any, void, any> {
  try {
    const response: any = yield call(addUserApi, action.payload)
    if (response.status === HTTP_CODE.OK || response.status === HTTP_CODE.CREATED) {
      // Backend returns: { success, message, data: {...user}, timestamp }
      const payload = response.data?.data || response.data || {}
      yield put(addUserSuccess(payload))
    }
  } catch (error) {
    yield put(addUserError(error))
  }
}
