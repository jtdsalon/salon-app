import type { FeedPost } from '../../components/Feed/types'

export const GET_FEED_POSTS = 'GET_FEED_POSTS'
export const GET_FEED_POSTS_SUCCESS = 'GET_FEED_POSTS_SUCCESS'
export const GET_FEED_POSTS_ERROR = 'GET_FEED_POSTS_ERROR'

export const UPDATE_FEED_POST = 'UPDATE_FEED_POST'
export const DELETE_FEED_POST = 'DELETE_FEED_POST'
export const ADD_FEED_POST = 'ADD_FEED_POST'

export const CREATE_POST = 'CREATE_POST'
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS'
export const CREATE_POST_ERROR = 'CREATE_POST_ERROR'

export const DELETE_POST = 'DELETE_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const TOGGLE_POST_LIKE = 'TOGGLE_POST_LIKE'
export const TOGGLE_POST_SAVE = 'TOGGLE_POST_SAVE'
export const ADD_POST_COMMENT = 'ADD_POST_COMMENT'
export const UPDATE_POST_COMMENT = 'UPDATE_POST_COMMENT'
export const DELETE_POST_COMMENT = 'DELETE_POST_COMMENT'
export const TOGGLE_POST_COMMENT_LIKE = 'TOGGLE_POST_COMMENT_LIKE'

export interface FeedState {
  posts: FeedPost[]
  loading: boolean
  error: any
  createLoading: boolean
  createError: any
}

export const INITIAL_FEED_STATE: FeedState = {
  posts: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
}

export type FeedAction =
  | { type: typeof GET_FEED_POSTS; meta?: { silent?: boolean } }
  | { type: typeof GET_FEED_POSTS_SUCCESS; payload: { data: FeedPost[] } }
  | { type: typeof GET_FEED_POSTS_ERROR; payload: any }
  | { type: typeof UPDATE_FEED_POST; payload: FeedPost }
  | { type: typeof DELETE_FEED_POST; payload: string }
  | { type: typeof ADD_FEED_POST; payload: FeedPost }
  | { type: typeof CREATE_POST; payload: Record<string, any> }
  | { type: typeof CREATE_POST_SUCCESS; payload: FeedPost }
  | { type: typeof CREATE_POST_ERROR; payload: any }
  | { type: typeof DELETE_POST; payload: string }
  | { type: typeof UPDATE_POST; payload: { postId: string; data: Record<string, any> } }
  | { type: typeof TOGGLE_POST_LIKE; payload: string }
  | { type: typeof TOGGLE_POST_SAVE; payload: string }
  | { type: typeof ADD_POST_COMMENT; payload: { postId: string; comment: string } }
  | { type: typeof UPDATE_POST_COMMENT; payload: { postId: string; commentId: string; comment: string } }
  | { type: typeof DELETE_POST_COMMENT; payload: { postId: string; commentId: string } }
  | { type: typeof TOGGLE_POST_COMMENT_LIKE; payload: { postId: string; commentId: string } }
