import * as T from './types'
import type { FeedState, FeedAction } from './types'

export const feedReducer = (state: FeedState = T.INITIAL_FEED_STATE, action: FeedAction): FeedState => {
  switch (action.type) {
    case T.GET_FEED_POSTS:
      return action.meta?.silent ? state : { ...state, loading: true, error: null }
    case T.GET_FEED_POSTS_SUCCESS:
      return { ...state, loading: false, posts: action.payload.data, error: null }
    case T.GET_FEED_POSTS_ERROR:
      return { ...state, loading: false, error: action.payload }

    case T.CREATE_POST:
      return { ...state, createLoading: true, createError: null }
    case T.CREATE_POST_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createError: null,
        posts: [action.payload, ...state.posts],
      }
    case T.CREATE_POST_ERROR:
      return { ...state, createLoading: false, createError: action.payload }

    case T.UPDATE_FEED_POST: {
      const updated = action.payload
      return {
        ...state,
        posts: state.posts.map(p => (p.id === updated.id ? updated : p)),
      }
    }
    case T.DELETE_FEED_POST:
      return { ...state, posts: state.posts.filter(p => p.id !== action.payload) }
    case T.ADD_FEED_POST:
      return { ...state, posts: [action.payload, ...state.posts] }

    default:
      return state
  }
}
