'use client'

import { Clock, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { isToday } from 'date-fns'
import type { TimelineDay, TimelinePeriod } from '@/lib/dashboard/types'

interface TimelineViewProps {
  days: TimelineDay[]
  period?: TimelinePeriod
  onPeriodChange?: (period: TimelinePeriod) => void
}

const priorityColors = {
  done: 'bg-zinc-500',
  low: 'bg-green-500',
  medium: 'bg-orange-500',
  high: 'bg-red-500',
}

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '01:00']
const periodLabels: { label: string; value: TimelinePeriod }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
]

export function TimelineView({ days, period: controlledPeriod, onPeriodChange }: TimelineViewProps) {
  const [internalPeriod, setInternalPeriod] = useState<TimelinePeriod>('week')
  const period = controlledPeriod ?? internalPeriod
  const [currentTimePos, setCurrentTimePos] = useState<number | null>(null)
  const [currentTimeLabel, setCurrentTimeLabel] = useState('')

  const setPeriod = (next: TimelinePeriod) => {
    setInternalPeriod(next)
    onPeriodChange?.(next)
  }

  const visibleDays = useMemo(() => {
    if (period !== 'today') return days
    const today = new Date()
    const match = days.filter((d) => {
      const dayDate = new Date(today.getFullYear(), d.month ?? today.getMonth(), d.date)
      return isToday(dayDate)
    })
    return match.length > 0 ? match : days.slice(0, 1)
  }, [days, period])

  useEffect(() => {
    const calculatePosition = () => {
      const now = new Date()
      const hour = now.getHours()
      const minutes = now.getMinutes()
      const startHour = 9
      const endHour = 13
      const totalMinutes = (endHour - startHour) * 60
      const currentMinutes = (hour - startHour) * 60 + minutes

      if (currentMinutes >= 0 && currentMinutes <= totalMinutes) {
        const position = 56 + (currentMinutes / 60) * 112
        setCurrentTimePos(position)
        setCurrentTimeLabel(`${hour % 12 || 12}:${minutes.toString().padStart(2, '0')}`)
      } else {
        setCurrentTimePos(null)
      }
    }

    calculatePosition()
    const interval = setInterval(calculatePosition, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-card rounded-[32px] overflow-hidden flex flex-col h-full border border-border">
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white tracking-tight">Projects</h2>
          <Button variant="ghost" size="sm" className="bg-white/5 text-zinc-400 rounded-full h-8 px-3 gap-2 border border-white/5" asChild>
            <Link href="/timeline">
              <Filter className="w-3.5 h-3.5" />
              <span className="text-xs">Filter</span>
            </Link>
          </Button>
        </div>

        <div className="bg-white/5 rounded-full p-1 flex items-center">
          {periodLabels.map(({ label, value }) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPeriod(value)}
              className={`rounded-full h-8 px-4 text-xs font-medium transition-all ${
                period === value ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 overflow-x-auto pb-4">
        <div className="flex flex-col border-r border-white/5 pt-14">
          {timeSlots.map((time) => (
            <div key={time} className="h-28 px-4 text-[10px] font-bold text-zinc-600 flex items-start justify-center">
              {time}
            </div>
          ))}
        </div>

        {currentTimePos !== null && period === 'week' && (
          <div
            className="absolute left-0 right-0 h-[1px] bg-red-500/50 z-20 flex items-center transition-all duration-1000"
            style={{ top: `${currentTimePos}px` }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
            <div className="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-bold rounded border border-red-500/20 backdrop-blur-sm">
              {currentTimeLabel}
            </div>
          </div>
        )}

        <div className="flex flex-1 min-w-[800px]">
          {visibleDays.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-12 text-zinc-500 text-sm">
              No tasks in this period
            </div>
          )}
          {visibleDays.map((day) => (
            <div key={`${day.day}-${day.date}`} className="flex-1 border-r border-white/5 min-w-[160px]">
              <div className="h-14 flex items-center justify-start px-4 border-b border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                  {day.day} <span className="text-white ml-1">{day.date}</span>
                </span>
              </div>

              <div className="p-3 space-y-4">
                {day.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/tasks?highlight=${project.id}`}
                    className={`block p-4 rounded-2xl border transition-all duration-300 ${
                      project.status === 'completed'
                        ? 'bg-zinc-900/50 border-white/5 opacity-80'
                        : project.status === 'in_progress'
                          ? 'bg-orange-500/5 border-orange-500/20'
                          : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[project.priority as keyof typeof priorityColors] || 'bg-blue-500'}`} />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                        {project.priority === 'done' ? 'Done' : project.priority}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white mb-1">{project.name}</div>
                    {project.description && (
                      <div className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2 mb-3">
                        {project.description}
                      </div>
                    )}

                    {project.time && (
                      <div className="flex items-center gap-0.5 text-[10px] text-zinc-500 pt-2 border-t border-white/5">
                        <Clock className="w-2.5 h-2.5" />
                        {project.time}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
