import { AxiosResponse } from 'axios';
import networkClient from './networkClient';
import { HTTP_METHOD } from '@/lib/enums/httpData';
import {
  GET_PROMOTIONS_BY_SALON_URL,
  GET_PROMOTIONS_TYPES_URL,
  GET_PROMOTION_BY_ID_URL,
  CREATE_PROMOTION_URL,
  UPDATE_PROMOTION_URL,
  DELETE_PROMOTION_URL,
  GET_PROMOTION_ANALYTICS_URL,
  GET_SALON_PROMOTION_ANALYTICS_URL,
  GET_SALON_PROMOTION_ANALYTICS_DASHBOARD_URL,
} from './endPoints';

export interface Promotion {
  id: string;
  salon_id: string;
  priority?: number | null;
  title: string;
  description?: string | null;
  code?: string | null;
  promotion_type: string;
  discount_type?: string | null;
  discount_value?: number | null;
  discount_percent?: number | null;
  bundle_price?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  happy_hour_schedule?: Record<string, unknown>;
  usage_limit?: number | null;
  usage_count?: number;
  view_count?: number;
  per_user_limit?: number | null;
  is_active?: boolean;
  is_featured?: boolean;
  created_at?: string;
  promotion_services?: Array<{ service_id: string; service?: { id: string; name: string } }>;
}

export interface CreatePromotionPayload {
  salon_id: string;
  title: string;
  description?: string;
  code?: string;
  promotion_type: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount_percent?: number;
  bundle_price?: number;
  start_date?: string;
  end_date?: string;
  happy_hour_schedule?: { days?: number[]; startTime?: string; endTime?: string };
  usage_limit?: number;
  per_user_limit?: number;
  is_active?: boolean;
  is_featured?: boolean;
  priority?: number;
  serviceIds?: string[];
}

const PROMOTION_TYPE_MAP: Record<string, string> = {
  'Service Discount': 'service_discount',
  'Bundle Package': 'bundle',
  'First-Time Offer': 'first_time',
  'Happy Hour': 'happy_hour',
  'Campaign': 'campaign',
  'Featured Promotion': 'featured',
};

const PROMOTION_TYPE_LABELS: Record<string, string> = {
  service_discount: 'Service Discount',
  bundle: 'Bundle Package',
  first_time: 'First-Time Offer',
  happy_hour: 'Happy Hour',
  campaign: 'Campaign',
  featured: 'Featured Promotion',
};

export function toApiPromotionType(uiType: string): string {
  return PROMOTION_TYPE_MAP[uiType] || uiType;
}

export function toUiPromotionType(apiType: string): string {
  return PROMOTION_TYPE_LABELS[apiType] || apiType;
}

export function getPromotionsBySalonApi(
  salonId: string,
  params?: { status?: string; type?: string; page?: number; limit?: number }
): Promise<AxiosResponse<{ data: Promotion[]; pagination?: { page: number; limit: number; total: number; pages: number } }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_PROMOTIONS_BY_SALON_URL.replace('{salonId}', salonId),
    params: params || {},
  });
}

export function getPromotionByIdApi(id: string): Promise<AxiosResponse<{ data: Promotion }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_PROMOTION_BY_ID_URL.replace('{id}', id),
  });
}

export function getPromotionTypesApi(): Promise<AxiosResponse<{ promotionTypes: string[]; discountTypes: string[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_PROMOTIONS_TYPES_URL,
  });
}

export function createPromotionApi(payload: CreatePromotionPayload): Promise<AxiosResponse<Promotion>> {
  const apiPayload = {
    ...payload,
    promotion_type: toApiPromotionType(payload.promotion_type),
  };
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: CREATE_PROMOTION_URL,
    data: apiPayload,
  });
}

export function updatePromotionApi(id: string, payload: Partial<CreatePromotionPayload>): Promise<AxiosResponse<Promotion>> {
  const apiPayload = payload.promotion_type
    ? { ...payload, promotion_type: toApiPromotionType(payload.promotion_type) }
    : payload;
  return networkClient().request({
    method: HTTP_METHOD.PUT,
    url: UPDATE_PROMOTION_URL.replace('{id}', id),
    data: apiPayload,
  });
}

export function deletePromotionApi(id: string): Promise<AxiosResponse<void>> {
  return networkClient().request({
    method: HTTP_METHOD.DELETE,
    url: DELETE_PROMOTION_URL.replace('{id}', id),
  });
}

export function getPromotionAnalyticsApi(promotionId: string): Promise<AxiosResponse<{ promotion: Promotion; usageCount: number; usageList: unknown[] }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_PROMOTION_ANALYTICS_URL.replace('{id}', promotionId),
  });
}

export function getSalonPromotionAnalyticsApi(salonId: string): Promise<AxiosResponse<Promotion[]>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_SALON_PROMOTION_ANALYTICS_URL.replace('{salonId}', salonId),
  });
}

export interface PromotionAnalyticsDashboard {
  summary: {
    totalViews: number;
    totalBookings: number;
    revenueGenerated: number;
    conversionRate: number;
  };
  dailyData: Array<{ name: string; date: string; usage: number; bookings: number }>;
  topPromotions: Array<{ id: string; name: string; value: number; color: string }>;
}

export function getSalonPromotionAnalyticsDashboardApi(
  salonId: string
): Promise<AxiosResponse<PromotionAnalyticsDashboard>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_SALON_PROMOTION_ANALYTICS_DASHBOARD_URL.replace('{salonId}', salonId),
  });
}

export type ApiPromotion = Promotion;

export interface PromotionCardData {
  id: string;
  title: string;
  type: string;
  discount: string;
  code?: string | null;
  status: 'Active' | 'Scheduled' | 'Expired';
  usageCount: number;
  views: number;
  isFeatured: boolean;
  is_active: boolean;
  startDate: string;
  endDate: string;
  /** Raw API promotion_type for card labels (e.g. bundle, happy_hour) */
  promotion_type?: string;
  discountType?: string | null;
  discountValue?: number | null;
  bundle_price?: number | null;
  happy_hour_schedule?: { days?: string[]; start?: string; end?: string; startTime?: string; endTime?: string } | null;
}

export function mapApiPromotionToCard(p: ApiPromotion): PromotionCardData {
  const now = new Date();
  const start = p.start_date ? new Date(p.start_date) : null;
  const end = p.end_date ? new Date(p.end_date) : null;
  let status: 'Active' | 'Scheduled' | 'Expired' = 'Active';
  if (!p.is_active) status = 'Expired';
  else if (start && start > now) status = 'Scheduled';
  else if (end && end < now) status = 'Expired';
  else if (p.usage_limit != null && (p.usage_count ?? 0) >= p.usage_limit) status = 'Expired';

  let discount = '';
  if (p.promotion_type === 'bundle' && p.bundle_price != null) {
    discount = `Rs.${Number(p.bundle_price).toLocaleString()} Bundle`;
  } else if (p.discount_type === 'percentage' && (p.discount_percent ?? p.discount_value) != null) {
    discount = `${p.discount_percent ?? p.discount_value}% OFF`;
  } else if (p.discount_type === 'fixed' && p.discount_value != null) {
    discount = `Rs.${Number(p.discount_value).toLocaleString()} OFF`;
  } else if (p.discount_percent != null) {
    discount = `${p.discount_percent}% OFF`;
  } else if (p.discount_value != null) {
    discount = `Rs.${Number(p.discount_value).toLocaleString()} OFF`;
  } else {
    discount = 'Special Offer';
  }

  const schedule = p.happy_hour_schedule as PromotionCardData['happy_hour_schedule'] | undefined;
  return {
    id: p.id,
    title: p.title,
    type: toUiPromotionType(p.promotion_type),
    discount,
    code: p.code || null,
    status,
    usageCount: p.usage_count ?? 0,
    views: p.view_count ?? 0,
    isFeatured: p.is_featured ?? false,
    is_active: p.is_active ?? true,
    startDate: start ? start.toLocaleDateString() : 'No start',
    endDate: end ? end.toLocaleDateString() : 'No end date',
    promotion_type: p.promotion_type,
    discountType: p.discount_type ?? null,
    discountValue: p.discount_value ?? p.discount_percent ?? null,
    bundle_price: p.bundle_price ?? null,
    happy_hour_schedule: schedule ?? null,
  };
}
