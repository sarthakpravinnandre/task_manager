'use client'

import { TimelineView } from '@/components/dashboard/timeline-view'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { useDashboard } from '@/hooks/use-dashboard'

export function TimelinePageContent() {
  const { data, error, isLoading, mutate } = useDashboard()

  if (isLoading) return <DashboardSkeleton layout="standard" />
  if (error || !data) {
    return (
      <section className="bg-card rounded-[32px] border border-border p-8 text-center">
        <p className="text-destructive mb-2">Failed to load timeline</p>
        <button
          type="button"
          onClick={() => mutate()}
          className="text-sm text-primary hover:underline"
        >
          Retry
        </button>
      </section>
    )
  }

  return (
    <section className="bg-card rounded-[32px] border border-border overflow-hidden shadow-xl">
      <TimelineView days={data.timeline} />
    </section>
  )
}
