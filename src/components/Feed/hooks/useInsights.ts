import { useState, useEffect, useCallback } from 'react'
import { getInsightsApi, mapInsightsResponse } from '@/services/api/insightsService'
import type { FeedPost } from '../types'

export interface InsightsData {
  followers: number
  followerGrowth: string
  engagementRate: string
  dailyReach: number[]
  topPosts: FeedPost[]
}

export function useInsights() {
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getInsightsApi()
      const raw = response?.data?.data
      if (raw) {
        setData(mapInsightsResponse(raw))
      } else {
        setData(mapInsightsResponse({}))
      }
    } catch (err: any) {
      const msg = err?.errorMessage ?? err?.response?.data?.message ?? err?.message ?? 'Failed to load insights'
      setError(typeof msg === 'string' ? msg : 'Failed to load insights')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  return { data, loading, error, refetch: fetchInsights }
}
