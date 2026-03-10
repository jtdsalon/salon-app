import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import {
  GET_SUBSCRIPTION_PLANS_URL,
  GET_SUBSCRIPTION_CURRENT_URL,
  CREATE_OR_UPGRADE_SUBSCRIPTION_URL,
  UPDATE_SUBSCRIPTION_URL,
  GET_SUBSCRIPTION_PAYMENTS_URL,
  DISMISS_SUBSCRIPTION_BANNER_URL,
} from './endPoints'

export type BannerType = 'trial_ending' | 'payment_due' | 'expired'

export interface PlanPrice {
  id: string
  billing_cycle: string
  duration_months: number
  base_price: number
  discount_percentage: number
  final_price: number
  currency: string
  is_most_popular: boolean
}

export interface PlanFeature {
  feature_key: string
  feature_value: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  code: string
  description: string | null
  is_active: boolean
  prices: PlanPrice[]
  features: PlanFeature[]
}

export interface SubscriptionBanner {
  type: BannerType
  daysLeft?: number
}

export interface SubscriptionSummary {
  subscription: {
    id: string
    salon_id: string
    plan_id: string
    plan_price_id: string | null
    status: string
    is_pro: boolean
    trial_start: string | null
    trial_end: string | null
    current_period_start: string | null
    current_period_end: string | null
    cancel_at_period_end: boolean
    plan: { id: string; name: string; code: string } | null
    plan_price: {
      id: string
      billing_cycle: string
      duration_months: number
      final_price: number
      currency: string
    } | null
  } | null
  isPro: boolean
  banner: SubscriptionBanner | null
}

export interface CreateSubscriptionPayload {
  plan_price_id: string
  trial_days?: number
}

export interface SubscriptionPaymentItem {
  id: string
  subscription_id: string
  provider_payment_id: string | null
  amount: number
  currency: string
  status: string
  paid_at: string | null
  created_at: string
}

interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

interface ApiPaginated<T> {
  success: true
  data: T[]
  pagination: { page: number; limit: number; total: number; pages: number }
  message?: string
}

export function getSubscriptionPlansApi(): Promise<
  AxiosResponse<ApiSuccess<SubscriptionPlan[]>>
> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_SUBSCRIPTION_PLANS_URL,
  })
}

export function getCurrentSubscriptionApi(): Promise<
  AxiosResponse<ApiSuccess<SubscriptionSummary>>
> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_SUBSCRIPTION_CURRENT_URL,
  })
}

export function createOrUpgradeSubscriptionApi(
  payload: CreateSubscriptionPayload
): Promise<AxiosResponse<ApiSuccess<SubscriptionSummary['subscription'] & { plan: object; plan_price: object }>>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: CREATE_OR_UPGRADE_SUBSCRIPTION_URL,
    data: payload,
  })
}

export function updateSubscriptionApi(
  subscriptionId: string,
  payload: { cancel_at_period_end?: boolean }
): Promise<AxiosResponse<ApiSuccess<unknown>>> {
  return networkClient().request({
    method: HTTP_METHOD.PATCH,
    url: UPDATE_SUBSCRIPTION_URL.replace('{id}', subscriptionId),
    data: payload,
  })
}

export function getSubscriptionPaymentsApi(params?: {
  page?: number
  limit?: number
}): Promise<AxiosResponse<ApiPaginated<SubscriptionPaymentItem>>> {
  const query = new URLSearchParams()
  if (params?.page != null) query.set('page', String(params.page))
  if (params?.limit != null) query.set('limit', String(params.limit))
  const url = query.toString()
    ? `${GET_SUBSCRIPTION_PAYMENTS_URL}?${query.toString()}`
    : GET_SUBSCRIPTION_PAYMENTS_URL
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url,
  })
}

export function dismissSubscriptionBannerApi(
  type: BannerType
): Promise<AxiosResponse<ApiSuccess<null>>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: DISMISS_SUBSCRIPTION_BANNER_URL.replace('{type}', type),
  })
}
