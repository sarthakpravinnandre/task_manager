'use client'

import useSWR from 'swr'
import type { DashboardData } from '@/lib/dashboard/types'

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch dashboard')
  return res.json()
})

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    '/api/dashboard',
    fetcher,
    { revalidateOnFocus: true }
  )

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}
