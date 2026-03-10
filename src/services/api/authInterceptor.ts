import networkClient from './networkClient'
import * as endpoints from './endPoints'
import { ROUTES } from '../../routes/routeConfig'
// import { useAuthContext } from '../../state/AuthContext'

// Setup response interceptor for token refresh
export const setupAuthInterceptor = () => {
  const client = networkClient()

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // If error is 401 and we haven't retried yet, try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            const response = await client.post(endpoints.REFRESH_TOKEN_URL, { refreshToken })
            
            // Update tokens
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('refreshToken', response.data.refreshToken)

            // Update auth header
            originalRequest.headers['Authorization'] = response.data.token

            // Retry original request
            return client(originalRequest)
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = ROUTES.LOGIN
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )
}
