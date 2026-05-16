'use client'

import { TimelineView } from '@/components/dashboard/timeline-view'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { useDashboard } from '@/hooks/use-dashboard'
import type { TimelinePeriod } from '@/lib/dashboard/types'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function TimelinePageContent() {
  const [period, setPeriod] = useState<TimelinePeriod>('week')
  const { data, error, isLoading, mutate } = useDashboard(period)

  if (isLoading) return <DashboardSkeleton />
  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load timeline</p>
        <Button variant="outline" onClick={() => mutate()}>Retry</Button>
      </div>
    )
  }

  return (
    <TimelineView
      days={data.timeline}
      period={period}
      onPeriodChange={setPeriod}
    />
  )
}
