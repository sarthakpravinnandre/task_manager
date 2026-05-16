'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTasks() {
  const { data, error, isLoading } = useSWR('/api/tasks', fetcher, {
    revalidateOnFocus: false,
  })

  return {
    tasks: data || [],
    error,
    isLoading,
  }
}

export function useMeetings() {
  const { data, error, isLoading } = useSWR('/api/meetings', fetcher, {
    revalidateOnFocus: false,
  })

  return {
    meetings: data || [],
    error,
    isLoading,
  }
}

export function useReminders() {
  const { data, error, isLoading } = useSWR('/api/reminders', fetcher, {
    revalidateOnFocus: false,
  })

  return {
    reminders: data || [],
    error,
    isLoading,
  }
}
