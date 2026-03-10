import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import {
  SEARCH_USERS_URL,
  GET_FOLLOWERS_URL,
  GET_FOLLOWING_URL,
  FOLLOW_USER_URL,
  UNFOLLOW_USER_URL,
  GET_USER_URL,
  ADD_USER_URL,
  UPDATE_USER_URL,
  GET_ALL_USERS_URL,
  GET_PAGINATED_USERS_URL,
  DELETE_USER_URL,
} from './endPoints'

interface User {
  id: string
  name: string
  email: string
  [key: string]: any
}

interface PaginatedResponse {
  data: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}


// Search users for mentions (by username/name)
export interface SearchUserResult {
  id: string
  name: string
  username: string
  avatar?: string
}

export function searchUsersApi(
  query: string
): Promise<AxiosResponse<{ data: SearchUserResult[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: SEARCH_USERS_URL,
    params: { q: query, limit: 10 },
  })
}

// Follow user
export function followUserApi(userId: string): Promise<AxiosResponse<{ data: { followed: boolean } }>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: FOLLOW_USER_URL.replace('{userid}', userId),
  })
}

// Unfollow user
export function unfollowUserApi(userId: string): Promise<AxiosResponse<{ data: { followed: boolean } }>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: UNFOLLOW_USER_URL.replace('{userid}', userId),
  })
}

// Get followers list
export function getFollowersApi(
  userId: string,
  page = 1,
  limit = 20
): Promise<AxiosResponse<{ data: FollowerUser[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_FOLLOWERS_URL.replace('{userid}', userId),
    params: { page, limit },
  })
}

// Get following list
export function getFollowingApi(
  userId: string,
  page = 1,
  limit = 20
): Promise<AxiosResponse<{ data: FollowerUser[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_FOLLOWING_URL.replace('{userid}', userId),
    params: { page, limit },
  })
}

// Get single user
export function getUserApi(userId: string): Promise<AxiosResponse<User>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_USER_URL.replace('{userid}', userId),
  })
}

// Add new user
export function addUserApi(userData: Partial<User>): Promise<AxiosResponse<User>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: ADD_USER_URL,
    data: userData,
  })
}

// Update user
export function updateUserApi(userId: string, userData: Partial<User>): Promise<AxiosResponse<User>> {
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: UPDATE_USER_URL.replace('{userid}', userId),
    data: userData,
  })
}

// Get all users
export function getUsersApi(): Promise<AxiosResponse<User[]>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_ALL_USERS_URL,
  })
}

// Get paginated users
export function getPaginatedUsersApi(
  page: number = 1,
  pageSize: number = 10
): Promise<AxiosResponse<PaginatedResponse>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_PAGINATED_USERS_URL,
    params: {
      page,
      pageSize,
    },
  })
}

// Delete user
export function deleteUserApi(userId: string): Promise<AxiosResponse<void>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: DELETE_USER_URL.replace('{userid}', userId),
  })
}
