import axios, { AxiosInstance } from 'axios'
import { baseApiUrl, apiKey as envApiKey } from '@/config/api'
import * as properties from '../../lib/properties/properties'
import * as constants from '../../lib/constants'
import { HTTP_CODE } from '../../lib/enums/httpData'
import { ROUTES, BASE_PATH } from '../../routes/routeConfig'

/** Clear auth storage and redirect to login (token expired, invalid session, or forbidden). */
function clearAuthAndRedirectToLogin(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  if (typeof window !== 'undefined') {
    const loginPath = BASE_PATH + (ROUTES.LOGIN.startsWith('/') ? ROUTES.LOGIN : '/' + ROUTES.LOGIN)
    window.location.href = loginPath
  }
}

interface ErrorResponse {
  statusCode: number
  errorMessage: string
  code?: string
  errors?: any
}

let isRefreshing = false
let failedQueue: Array<{ resolve: Function; reject: Function }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  isRefreshing = false
  failedQueue = []
}

/* Function to create and configure an axios instance for network requests */
const networkClient = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: baseApiUrl,
  })

  /* Request interceptor to add headers and modify config before making a request */
  axiosInstance.interceptors.request.use(
    async (config) => {
      /* For FormData, let browser set Content-Type with boundary – do not override */
      if (config.data instanceof FormData) {
        delete (config.headers as Record<string, unknown>)['Content-Type']
      }

      /* Retrieve access token and add to headers for authorization */
      const accessToken = localStorage.getItem('token')
      if (accessToken) {
        config.headers[constants.HEADER_KEY_AUTHORIZATION] = `Bearer ${accessToken}`
      }

      /* Add other required headers */
      if (constants.HEADER_KEY_API_KEY) {
        config.headers[constants.HEADER_KEY_API_KEY] = envApiKey || ''
      }
      if (constants.HEADER_KEY_ACCEPT) {
        config.headers[constants.HEADER_KEY_ACCEPT] = constants.HEADER_VAL_ACCEPT
      }
      if (constants.HEADER_KEY_PLATFORM) {
        config.headers[constants.HEADER_KEY_PLATFORM] = constants.HEADER_VAL_PLATFORM
      }
      if (constants.HEADER_APP_VERSION) {
        config.headers[constants.HEADER_APP_VERSION] = constants.HEADER_APP_VERSION_VAL
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  /* Response interceptor to handle error responses and token refresh */
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      const isAuthRequest =
        originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/register')

      // Do not run refresh/redirect for login or register failures - let caller handle 401/400
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
        if (isRefreshing) {
          // Queue the request while token is being refreshed
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return axiosInstance(originalRequest)
          }).catch(err => {
            return Promise.reject(err)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = localStorage.getItem('refreshToken')
          
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          // Create a new axios instance to avoid infinite loops
          const refreshClient = axios.create({ baseURL })
          
          const response = await refreshClient.post('/auth/refresh', { refreshToken })
          
          const newToken = response.data?.data?.token || response.data?.token
          const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken

          if (newToken && newRefreshToken) {
            // Update tokens in localStorage
            localStorage.setItem('token', newToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            // Update the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`

            // Process queued requests
            processQueue(null, newToken)

            // Retry original request
            return axiosInstance(originalRequest)
          } else {
            throw new Error('Invalid token response')
          }
        } catch (refreshError) {
          processQueue(refreshError, null)
          clearAuthAndRedirectToLogin()
          return Promise.reject(refreshError)
        }
      }

      /* 403 Forbidden: invalid user / session – clear and redirect to login */
      if (error.response?.status === HTTP_CODE.FORBIDDEN) {
        const code = error.response?.data?.code as string | undefined
        const message = (error.response?.data?.message || error.response?.data?.error || '') as string
        const isAuthRelated =
          /session|token|unauthorized|forbidden|invalid user|access denied/i.test(message) ||
          /TOKEN_EXPIRED|INVALID_SESSION|SESSION_TIMEOUT|INVALID_USER/i.test(code || '')
        if (isAuthRelated) {
          clearAuthAndRedirectToLogin()
          return Promise.reject(error)
        }
      }

      /* 401 after retry (e.g. refresh succeeded but request still rejected): redirect to login */
      if (
        error.response?.status === HTTP_CODE.UNAUTHORIZED &&
        !isAuthRequest &&
        originalRequest._retry
      ) {
        clearAuthAndRedirectToLogin()
        return Promise.reject(error)
      }

      /* Pass through abort/cancel errors without transforming */
      if (error.code === 'ERR_CANCELED' || error.message === 'canceled') {
        return Promise.reject(error)
      }

      /* Create error object based on backend response format */
      const icError: ErrorResponse = {
        statusCode: error.response?.status || HTTP_CODE.INTERNAL_SERVER_ERROR,
        errorMessage:
          error.response?.data?.message || 
          error.message || 
          properties.ERROR_POPUP_MESSAGE || 
          'An error occurred',
        code: error.response?.data?.code,
        errors: error.response?.data?.errors,
      }
      return Promise.reject(icError)
    }
  )

  return axiosInstance
}

export default networkClient
