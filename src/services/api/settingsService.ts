import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'

export interface UserSettings {
  id: string
  userId: string
  name?: string
  email?: string
  phone?: string
  bio?: string
  avatar?: string
  twoFactor: boolean
  notifications: {
    email: boolean
    sms: boolean
    system: boolean
    marketing: boolean
    newBookings: boolean
    dailyReports: boolean
    systemUpdates: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  id: string
  action: string
  targetType: string
  targetId: string
  changes: any
  createdAt: string
}

/**
 * Convert settings data from camelCase (frontend) to snake_case (backend)
 */
const convertToSnakeCase = (data: any): any => {
  const converted: any = {}

  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'userId':
        converted.user_id = value
        break
      case 'twoFactor':
        converted.two_factor_enabled = value
        break
      case 'avatarUrl':
      case 'avatar':
        converted.avatar_url = value
        break
      default:
        converted[key] = value
    }
  }

  return converted
}

export function getUserSettingsApi(userId: string): Promise<AxiosResponse<{ data: UserSettings }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: `/settings/${userId}`,
  })
}

export function updateUserSettingsApi(
  userId: string,
  settingsData: Partial<UserSettings> & { emailVerificationCode?: string }
): Promise<AxiosResponse<{ data: UserSettings }>> {
  const snakeCaseData = convertToSnakeCase(settingsData)
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: `/settings/${userId}`,
    data: snakeCaseData,
  })
}

export function updatePasswordApi(userId: string, passwordData: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: `/settings/${userId}/password`,
    data: passwordData,
  })
}

export function updateNotificationsApi(userId: string, notificationData: any): Promise<AxiosResponse<{ data: UserSettings }>> {
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: `/settings/${userId}/notifications`,
    data: notificationData,
  })
}

export function toggleTwoFactorApi(userId: string, enabled: boolean): Promise<AxiosResponse<{ data: UserSettings }>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: `/settings/${userId}/two-factor`,
    data: { enabled },
  })
}

export function getActivityLogApi(userId: string, limit = 10, offset = 0): Promise<AxiosResponse<{ data: ActivityLog[]; total?: number }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: `/settings/${userId}/activity`,
    params: { limit, offset },
  })
}

export function deleteAccountApi(userId: string, password: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: `/settings/${userId}/account`,
    data: { password },
  })
}
