'use client'

import { EnhancedTasksList } from '@/components/dashboard/enhanced-tasks-list'
import { EnhancedMeetingsList } from '@/components/dashboard/enhanced-meetings-list'
import { EnhancedActivityPanel } from '@/components/dashboard/enhanced-activity-panel'
import { EnhancedReminders } from '@/components/dashboard/enhanced-reminders'
import { TimelineView } from '@/components/dashboard/timeline-view'
import { ProjectsChart } from '@/components/dashboard/projects-chart'
import { ColorPaletteCard } from '@/components/dashboard/color-palette-card'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { Button } from '@/components/ui/button'
import { useDashboard } from '@/hooks/use-dashboard'
import type { TimelinePeriod } from '@/lib/dashboard/types'
import { useState, type ReactNode } from 'react'

type DashboardLayout = 'developer' | 'standard'

interface DashboardContentProps {
  layout?: DashboardLayout
  title?: string
  subtitle?: string
  headerSlot?: ReactNode
}

export function DashboardContent({
  layout = 'developer',
  title,
  subtitle,
  headerSlot,
}: DashboardContentProps) {
  const [timelinePeriod, setTimelinePeriod] = useState<TimelinePeriod>('week')
  const { data, error, isLoading, mutate } = useDashboard(timelinePeriod)

  if (isLoading) {
    return <DashboardSkeleton layout={layout} />
  }

  if (error || !data) {
    return (
      <div className="bg-card rounded-3xl border border-red-500/20 p-8 text-center">
        <p className="text-red-400 mb-2">Failed to load dashboard data</p>
        <p className="text-zinc-500 text-sm mb-4">Check your database connection and try again.</p>
        <Button variant="outline" onClick={() => mutate()} className="border-white/10 text-white hover:bg-white/5">
          Retry
        </Button>
      </div>
    )
  }

  const {
    tasks,
    meetings,
    reminders,
    stats,
    completion,
    activityTrend,
    projects,
    totalProjects,
    projectsTrend,
    timeline,
    activeTask,
  } = data

  if (layout === 'standard') {
    return (
      <div>
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        )}
        {headerSlot}

        <div className="mb-6">
          <TimelineView
            days={timeline}
            period={timelinePeriod}
            onPeriodChange={setTimelinePeriod}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <EnhancedTasksList tasks={tasks} count={tasks.length} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <EnhancedMeetingsList meetings={meetings} count={meetings.length} />
            <ProjectsChart
              projects={projects}
              totalProjects={totalProjects}
              trend={projectsTrend}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <EnhancedActivityPanel
              stats={stats}
              completion={completion}
              trend={activityTrend}
            />
            <EnhancedReminders reminders={reminders} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-8">
        {headerSlot}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTask ? (
            <ColorPaletteCard
              title={activeTask.title}
              subtitle={activeTask.subtitle}
              isPlaying={true}
            />
          ) : (
            <div className="bg-card border border-border rounded-[32px] p-6 flex items-center justify-center min-h-[280px]">
              <p className="text-zinc-500 text-sm">No active task</p>
            </div>
          )}
          <EnhancedTasksList tasks={tasks} count={tasks.length} />
          <EnhancedMeetingsList meetings={meetings} count={meetings.length} />
        </div>

        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          <TimelineView
            days={timeline}
            period={timelinePeriod}
            onPeriodChange={setTimelinePeriod}
          />
        </div>
      </div>

      <div className="w-full lg:w-[380px] space-y-6">
        <div className="bg-card rounded-3xl border border-border p-6 shadow-xl shadow-black/20">
          <EnhancedActivityPanel
            stats={stats}
            completion={completion}
            trend={activityTrend}
          />
        </div>
        <div className="bg-card rounded-3xl border border-border p-6 shadow-xl shadow-black/20">
          <ProjectsChart
            projects={projects}
            totalProjects={totalProjects}
            trend={projectsTrend}
          />
        </div>
        <div className="bg-card rounded-3xl border border-border p-6 shadow-xl shadow-black/20">
          <EnhancedReminders reminders={reminders} />
        </div>
      </div>
    </div>
  )
}
