'use client'

import { apiFetcher } from '@/lib/api/fetcher'
import type { DashboardData, TimelinePeriod } from '@/lib/dashboard/types'
import useSWR from 'swr'

export function useDashboard(period: TimelinePeriod = 'week') {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    `/api/dashboard?period=${period}`,
    apiFetcher,
    { revalidateOnFocus: true }
  )

  return {
    data,
    error,
    isLoading,
    mutate,
    retry: () => mutate(),
  }
}

export function useTasks() {
  const { data, error, isLoading, mutate } = useSWR('/api/tasks', apiFetcher, {
    revalidateOnFocus: false,
  })

  return {
    tasks: data ?? [],
    error,
    isLoading,
    mutate,
  }
}

export function useMeetings() {
  const { data, error, isLoading, mutate } = useSWR('/api/meetings', apiFetcher, {
    revalidateOnFocus: false,
  })

  return {
    meetings: data ?? [],
    error,
    isLoading,
    mutate,
  }
}

export function useReminders() {
  const { data, error, isLoading, mutate } = useSWR('/api/reminders', apiFetcher, {
    revalidateOnFocus: false,
  })

  return {
    reminders: data ?? [],
    error,
    isLoading,
    mutate,
  }
}

export function useMessages() {
  const { data, error, isLoading, mutate } = useSWR('/api/messages', apiFetcher, {
    revalidateOnFocus: false,
  })

  return {
    messages: data ?? [],
    error,
    isLoading,
    mutate,
  }
}

type SupportTicket = {
  id: string
  subject: string
  description: string
  status: string
}

export function useSupportTickets() {
  const { data, error, isLoading, mutate } = useSWR<SupportTicket[]>('/api/support-tickets', apiFetcher, {
    revalidateOnFocus: false,
  })

  return {
    tickets: data ?? [],
    error,
    isLoading,
    mutate,
  }
}

export function useVoiceChannels() {
  const { data, error, isLoading, mutate } = useSWR('/api/voice-channels', apiFetcher, {
    revalidateOnFocus: false,
  })

  return {
    channels: data ?? [],
    error,
    isLoading,
    mutate,
  }
}
