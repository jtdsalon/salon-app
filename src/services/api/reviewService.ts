import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import { GET_SALON_REVIEWS_URL, REPLY_TO_REVIEW_URL } from './endPoints'
import type { SalonReview } from '@/components/SalonProfile/types'

/** Normalize API review shape to SalonReview */
function normalizeReview(raw: any): SalonReview {
  const rawUser = raw.user ?? raw.userName ?? raw.customerName;
  const userDisplay =
    typeof rawUser === 'string'
      ? rawUser
      : rawUser && typeof rawUser === 'object'
        ? [rawUser.first_name ?? rawUser.firstName, rawUser.last_name ?? rawUser.lastName].filter(Boolean).join(' ').trim() || 'Customer'
        : 'Customer';
  return {
    id: raw.id ?? raw._id ?? '',
    user: userDisplay,
    userId: raw.userId ?? raw.user_id ?? raw.customerId,
    avatar: raw.avatar ?? raw.userAvatar ?? raw.user_avatar ?? (rawUser && typeof rawUser === 'object' ? rawUser.avatar : null) ?? undefined,
    rating: typeof raw.rating === 'number' ? raw.rating : Number(raw.rating) || 0,
    comment: raw.comment ?? raw.text ?? raw.review ?? '',
    date: raw.date ?? raw.timeAgo ?? raw.createdAt ?? raw.created_at ?? '',
    service: (() => {
      const s = raw.service ?? raw.serviceName ?? raw.service_name;
      return typeof s === 'string' ? s : (s && typeof s === 'object' && (s.name ?? s.title) != null ? String(s.name ?? s.title) : 'Service');
    })(),
    serviceId: raw.serviceId ?? raw.service_id,
    reply: raw.reply ?? raw.salonReply ?? raw.salon_reply ?? null,
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
  }
}

export function getSalonReviewsApi(salonId: string): Promise<AxiosResponse<SalonReview[]>> {
  return networkClient()
    .request({
      method: HTTP_METHOD.GET,
      url: GET_SALON_REVIEWS_URL.replace('{salonId}', salonId),
    })
    .then((res) => {
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data?.reviews ?? [])
      return { ...res, data: data.map(normalizeReview) } as AxiosResponse<SalonReview[]>
    })
}

export function replyToReviewApi(reviewId: string, replyText: string): Promise<AxiosResponse<any>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: REPLY_TO_REVIEW_URL.replace('{reviewId}', reviewId),
    data: { reply: replyText },
  })
}
