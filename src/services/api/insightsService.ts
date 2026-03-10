import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import { GET_INSIGHTS_URL } from './endPoints'
import type { FeedPost } from '../../components/Feed/types'
import { mapApiPostToFeedPost } from './feedService'

export interface InsightsResponse {
  followers?: number
  followerGrowth?: string
  engagementRate?: string
  reach?: number
  reachGrowth?: string
  dailyReach?: number[]
  topPosts?: any[]
}

export interface InsightsApiResponse {
  data: InsightsResponse
}

export function getInsightsApi(): Promise<AxiosResponse<InsightsApiResponse>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_INSIGHTS_URL,
  })
}

/** Map API insights response to normalized shape (handles snake_case and camelCase) */
export function mapInsightsResponse(raw: InsightsResponse | any): {
  followers: number
  followerGrowth: string
  engagementRate: string
  dailyReach: number[]
  topPosts: FeedPost[]
} {
  const r = raw ?? {}
  const topPostsRaw = r.topPosts ?? r.top_posts ?? []
  const topPosts: FeedPost[] = topPostsRaw.map((p: any) =>
    p?.id ? mapApiPostToFeedPost(p) : p
  )

  const dailyReach = r.dailyReach ?? r.daily_reach
  const hasDailyReach = Array.isArray(dailyReach) && dailyReach.length > 0

  return {
    followers: r.followers ?? 0,
    followerGrowth: r.followerGrowth ?? r.follower_growth ?? '0%',
    engagementRate: r.engagementRate ?? r.engagement_rate ?? '0%',
    dailyReach: hasDailyReach ? dailyReach : [35, 45, 30, 60, 85, 55, 95],
    topPosts,
  }
}
