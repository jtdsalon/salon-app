import networkClient from './networkClient'
import * as endpoints from './endPoints'

const client = networkClient()

export interface LoginRequest {
  email: string
  password: string
}

export interface SalonRole {
  salonId: string
  role: string
  permissions?: string[]
}

export interface LoginResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    salonId?: string
    roles?: SalonRole[]
  }
  token: string
  refreshToken: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  category?: string
  role?: string
}

export interface RegisterResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    salonId?: string
    roles?: SalonRole[]
  }
  token: string
  refreshToken: string
}

/** Backend can return success payload or error payload (e.g. { success: false, message, code }) */
export type RegisterApiResponse = RegisterResponse | {
  success?: boolean
  message?: string
  code?: string
  data?: { token?: string; refreshToken?: string; user?: unknown }
  token?: string
  refreshToken?: string
  user?: unknown
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await client.post<LoginResponse>(endpoints.LOGIN_URL, credentials)
      
      // Extract tokens and user from response
      const { data } = response;
      const token = data.data?.token || data.token;
      const refreshToken = data.data?.refreshToken || data.refreshToken;
      const user = data.data?.user || data.user;

      // Store tokens in localStorage only if they exist
      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterApiResponse> {
    try {
      const response = await client.post<RegisterApiResponse>(endpoints.REGISTER_URL, userData)
      const data = response.data;

      // Do not store tokens when backend returns success: false or error codes (CONFLICT, BAD_REQUEST)
      if ((data as RegisterApiResponse)?.success === false || (data as RegisterApiResponse)?.code) {
        return data;
      }

      const token = (data as RegisterApiResponse)?.data?.token ?? (data as RegisterApiResponse)?.token;
      const refreshToken = (data as RegisterApiResponse)?.data?.refreshToken ?? (data as RegisterApiResponse)?.refreshToken;
      const user = (data as RegisterApiResponse)?.data?.user ?? (data as RegisterApiResponse)?.user;

      // Store tokens so user can access /verification page; navigation is driven by is_verified from backend.
      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await client.post<RefreshTokenResponse>(endpoints.REFRESH_TOKEN_URL, {
        refreshToken,
      })

      // Update token in localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)

      return response.data
    } catch (error) {
      throw error
    }
  }

  async forgotPassword(email: string): Promise<{ ok: boolean; message: string }> {
    const response = await client.post<{ data?: { ok?: boolean; message?: string }; ok?: boolean; message?: string }>(
      endpoints.FORGOT_PASSWORD_URL,
      { email }
    )
    const payload = response.data?.data ?? response.data
    return { ok: payload?.ok ?? true, message: payload?.message ?? 'If an account exists, you will receive a reset link.' }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ ok: boolean; message: string }> {
    const response = await client.post<{ data?: { ok?: boolean; message?: string }; ok?: boolean; message?: string }>(
      endpoints.RESET_PASSWORD_URL,
      { token, newPassword }
    )
    const payload = response.data?.data ?? response.data
    return { ok: payload?.ok ?? true, message: payload?.message ?? 'Password has been reset.' }
  }

  async resendVerificationEmail(): Promise<{ ok: boolean; message: string }> {
    const response = await client.post<{ data?: { ok?: boolean; message?: string }; ok?: boolean; message?: string }>(
      endpoints.SEND_VERIFICATION_EMAIL_URL
    )
    const payload = response.data?.data ?? response.data
    return { ok: payload?.ok ?? true, message: payload?.message ?? 'Verification code sent.' }
  }

  /**
   * Verify OTP for post-signup. Calls POST /auth/verify.
   * Uses code from email or sample 123456 when SMTP not configured.
   */
  async verifyOtp(emailCode: string, phoneCode: string): Promise<{ user: unknown }> {
    try {
      const response = await client.post<{ data?: { user?: unknown }; user?: unknown }>(
        endpoints.VERIFY_URL,
        { emailCode, phoneCode }
      )
      const payload = response.data?.data ?? response.data
      const user = payload?.user ?? (response.data as { user?: unknown })?.user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      return { user }
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await client.post(endpoints.LOGOUT_URL)
    } catch (error) {
      // Continue logout even if API call fails
      console.error('Logout API error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  getStoredUser() {
    try {
      const user = localStorage.getItem('user')
      if (!user || user === 'undefined' || user === 'null') {
        return null
      }
      return JSON.parse(user)
    } catch (error) {
      console.error('Error parsing stored user:', error)
      localStorage.removeItem('user')
      return null
    }
  }

  getStoredToken() {
    const token = localStorage.getItem('token')
    if (token === 'undefined' || token === 'null') {
      localStorage.removeItem('token')
      return null
    }
    return token
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  }
}

export default new AuthService()
