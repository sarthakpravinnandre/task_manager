import {
  format,
  differenceInMinutes,
  isToday,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  isWithinInterval,
  subWeeks,
} from 'date-fns'
import type { Meeting, Project, Reminder, Task } from '@prisma/client'
import type {
  DashboardMeeting,
  DashboardProject,
  DashboardReminder,
  DashboardStat,
  DashboardTask,
  TimelineDay,
  TimelinePeriod,
} from './types'

type TaskWithProject = Task & { project: Project | null }
type MeetingRecord = Meeting

const PROJECT_COLORS = ['#f97316', '#22c55e', '#ef4444', '#3b82f6', '#7c3aed', '#06b6d4', '#f59e0b']

export function mapTaskToDashboard(
  task: TaskWithProject,
  featured = false
): DashboardTask {
  return {
    id: task.id,
    title: task.title,
    project: task.project?.name ?? 'General',
    status: task.status as DashboardTask['status'],
    priority: task.priority as DashboardTask['priority'],
    featured,
  }
}

export function mapMeetingToDashboard(
  meeting: MeetingRecord,
  highlighted = false
): DashboardMeeting {
  const now = new Date()
  let status: DashboardMeeting['status'] = 'scheduled'
  if (now >= meeting.startTime && now <= meeting.endTime) status = 'ongoing'
  else if (now > meeting.endTime) status = 'completed'

  const durationMins = differenceInMinutes(meeting.endTime, meeting.startTime)
  const hours = Math.floor(durationMins / 60)
  const mins = durationMins % 60
  const duration =
    hours > 0
      ? `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
      : `00:${mins.toString().padStart(2, '0')}`

  return {
    id: meeting.id,
    title: meeting.title,
    time: format(meeting.startTime, 'hh:mm a'),
    duration,
    attendees: meeting.attendees,
    status,
    highlighted,
  }
}

export function mapReminderToDashboard(reminder: Reminder): DashboardReminder {
  return {
    id: reminder.id,
    title: reminder.title,
    time: format(reminder.scheduledAt, 'hh:mm a'),
    priority: reminder.priority as DashboardReminder['priority'],
  }
}

export function buildProjectsChart(tasks: TaskWithProject[]): {
  projects: DashboardProject[]
  totalProjects: number
  trend: number
} {
  const counts = new Map<string, { name: string; color: string; count: number }>()

  for (const task of tasks) {
    const key = task.projectId ?? 'unassigned'
    const name = task.project?.name ?? 'Unassigned'
    const color = task.project?.color ?? '#71717a'
    const existing = counts.get(key)
    if (existing) {
      existing.count += 1
    } else {
      counts.set(key, { name, color, count: 1 })
    }
  }

  const total = tasks.length || 1
  const projects: DashboardProject[] = Array.from(counts.values()).map((p) => ({
    name: p.name,
    count: p.count,
    color: p.color,
    percentage: Math.round((p.count / total) * 100),
  }))

  const totalProjects = counts.size
  const trend = projects.length > 1 ? projects[0].percentage - projects[1].percentage : 0

  return { projects, totalProjects, trend }
}

export function buildWeeklyStats(tasks: Task[]): {
  stats: DashboardStat[]
  completion: number
  trend: number
} {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 5)

  const stats: DashboardStat[] = days.map((day) => {
    const dayTasks = tasks.filter((t) => {
      const ref = t.dueDate ?? t.createdAt
      return (
        ref >= startOfDay(day) &&
        ref <= endOfDay(day)
      )
    })
    const completed = dayTasks.filter((t) => t.status === 'completed').length
    const value = dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0
    return {
      label: format(day, 'EEE').slice(0, 3),
      value,
      change: 0,
      trend: value >= 50 ? ('up' as const) : ('down' as const),
    }
  })

  const completed = tasks.filter((t) => t.status === 'completed').length
  const completion = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  const lastWeekStart = subWeeks(weekStart, 1)
  const lastWeekEnd = subWeeks(weekEnd, 1)
  const thisWeekTasks = tasks.filter((t) => {
    const ref = t.updatedAt
    return isWithinInterval(ref, { start: weekStart, end: weekEnd })
  })
  const lastWeekTasks = tasks.filter((t) => {
    const ref = t.updatedAt
    return isWithinInterval(ref, { start: lastWeekStart, end: lastWeekEnd })
  })
  const thisRate =
    thisWeekTasks.length > 0
      ? thisWeekTasks.filter((t) => t.status === 'completed').length / thisWeekTasks.length
      : 0
  const lastRate =
    lastWeekTasks.length > 0
      ? lastWeekTasks.filter((t) => t.status === 'completed').length / lastWeekTasks.length
      : 0
  const trend =
    lastRate > 0 ? Math.round(((thisRate - lastRate) / lastRate) * 100) : Math.round(thisRate * 100)

  return { stats, completion, trend }
}

function mapTasksToTimelineProjects(
  dayTasks: TaskWithProject[]
): TimelineDay['projects'] {
  return dayTasks.slice(0, 6).map((t) => ({
    id: t.id,
    name: t.title,
    description: t.description ?? undefined,
    priority: (t.status === 'completed'
      ? 'done'
      : t.priority === 'high'
        ? 'high'
        : t.priority === 'low'
          ? 'low'
          : 'medium') as TimelineDay['projects'][0]['priority'],
    status: t.status as TimelineDay['projects'][0]['status'],
    time: t.dueDate ? format(t.dueDate, 'hh:mm a') : undefined,
  }))
}

export function buildTimeline(
  tasks: TaskWithProject[],
  period: TimelinePeriod = 'week'
): TimelineDay[] {
  const now = new Date()

  if (period === 'today') {
    const day = now
    const dayTasks = tasks.filter((t) => {
      const ref = t.dueDate ?? t.createdAt
      return ref >= startOfDay(day) && ref <= endOfDay(day)
    })
    return [
      {
        day: format(day, 'EEE').toUpperCase(),
        date: day.getDate(),
        month: day.getMonth(),
        projects: mapTasksToTimelineProjects(dayTasks),
      },
    ]
  }

  if (period === 'month') {
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd }).filter(
      (_, i, arr) => arr.length <= 14 || i % Math.ceil(arr.length / 14) === 0
    )
    return days.map((day) => ({
      day: format(day, 'EEE').toUpperCase(),
      date: day.getDate(),
      month: day.getMonth(),
      projects: mapTasksToTimelineProjects(
        tasks.filter((t) => {
          const ref = t.dueDate ?? t.createdAt
          return ref >= startOfDay(day) && ref <= endOfDay(day)
        })
      ),
    }))
  }

  if (period === 'year') {
    const yearStart = startOfYear(now)
    const yearEnd = endOfYear(now)
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })
    return months.map((month) => {
      const monthTasks = tasks.filter((t) => {
        const ref = t.dueDate ?? t.createdAt
        return isWithinInterval(ref, {
          start: startOfMonth(month),
          end: endOfMonth(month),
        })
      })
      return {
        day: format(month, 'MMM').toUpperCase(),
        date: month.getMonth() + 1,
        month: month.getMonth(),
        projects: mapTasksToTimelineProjects(monthTasks),
      }
    })
  }

  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const days = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(now, { weekStartsOn: 1 }),
  }).slice(0, 5)

  return days.map((day) => ({
    day: format(day, 'EEE').toUpperCase(),
    date: day.getDate(),
    month: day.getMonth(),
    projects: mapTasksToTimelineProjects(
      tasks.filter((t) => {
        const ref = t.dueDate ?? t.createdAt
        return ref >= startOfDay(day) && ref <= endOfDay(day)
      })
    ),
  }))
}

export function filterTodayTasks(tasks: TaskWithProject[]): TaskWithProject[] {
  const today = new Date()
  const todayTasks = tasks.filter(
    (t) => (t.dueDate && isToday(t.dueDate)) || (!t.dueDate && isToday(t.createdAt))
  )
  if (todayTasks.length > 0) return todayTasks
  return tasks.filter((t) => t.status !== 'completed').slice(0, 5)
}

export function filterTodayMeetings(meetings: MeetingRecord[]): MeetingRecord[] {
  const todayMeetings = meetings.filter((m) => isToday(m.startTime))
  if (todayMeetings.length > 0) return todayMeetings
  return meetings.filter((m) => m.startTime >= new Date()).slice(0, 4)
}

export function findNextMeetingId(meetings: MeetingRecord[]): string | null {
  const now = new Date()
  const upcoming = meetings
    .filter((m) => m.endTime >= now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  return upcoming[0]?.id ?? null
}

export function getDefaultProjectColor(index: number): string {
  return PROJECT_COLORS[index % PROJECT_COLORS.length]
}
