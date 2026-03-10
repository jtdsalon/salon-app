import { call, put, select } from 'redux-saga/effects'
import * as T from './types'
import type { FeedPost } from '../../components/Feed/types'
import { getFeedPostsApi, mapApiPostToFeedPost } from '../../services/api/feedService'
import { HTTP_CODE } from '../../lib/enums/httpData'
import { selectUser } from '../auth/auth.selectors'

/** @param meta.silent - when true, does not set loading (avoids unmounting feed on like/comment) */
export const getFeedPosts = (meta?: { silent?: boolean }) => ({
  type: T.GET_FEED_POSTS,
  meta,
})

const getFeedPostsSuccess = (data: FeedPost[]) => ({
  type: T.GET_FEED_POSTS_SUCCESS,
  payload: { data },
})

const getFeedPostsError = (payload: any) => ({
  type: T.GET_FEED_POSTS_ERROR,
  payload,
})

export function* getFeedPostsSaga(): Generator<any, void, any> {
  try {
    const user: { salonId?: string; pages?: { salonId: string; pageId: string }[] } | null = yield select(selectUser)
    const actorPageId = user?.pages?.find((p) => p.salonId === user?.salonId)?.pageId ?? null
    const response: any = yield call(getFeedPostsApi, 1, 50, actorPageId)
    if (response?.status === HTTP_CODE.OK || response?.status === HTTP_CODE.CREATED) {
      const raw = response?.data?.data ?? []
      const data = Array.isArray(raw) ? raw.map((p: any) => p?.id ? mapApiPostToFeedPost(p) : p) : []
      yield put(getFeedPostsSuccess(data))
    } else {
      yield put(getFeedPostsError(response))
    }
  } catch (err) {
    yield put(getFeedPostsError(err))
  }
}
