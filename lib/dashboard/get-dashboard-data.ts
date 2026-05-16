import { getScopedUserIds } from '@/lib/api/scope'
import { format } from 'date-fns'
import prisma from '@/lib/prisma'
import type { DashboardData, TimelinePeriod } from './types'
import {
  buildProjectsChart,
  buildTimeline,
  buildWeeklyStats,
  filterTodayMeetings,
  filterTodayTasks,
  findNextMeetingId,
  mapMeetingToDashboard,
  mapReminderToDashboard,
  mapTaskToDashboard,
} from './mappers'

export async function getDashboardData(
  userId: string,
  role: string | null | undefined,
  teamId: string | null | undefined,
  timelinePeriod: TimelinePeriod = 'week'
): Promise<DashboardData> {
  const userIds = await getScopedUserIds(userId, role, teamId)

  const [tasks, meetings, reminders] = await Promise.all([
    prisma.task.findMany({
      where: { userId: { in: userIds } },
      include: { project: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.meeting.findMany({
      where: { userId: { in: userIds } },
      orderBy: { startTime: 'asc' },
    }),
    prisma.reminder.findMany({
      where: { userId: { in: userIds } },
      orderBy: { scheduledAt: 'asc' },
    }),
  ])

  const todayTasks = filterTodayTasks(tasks)
  const featuredTask = todayTasks.find((t) => t.status === 'in_progress') ?? todayTasks[0]
  const todayMeetings = filterTodayMeetings(meetings)
  const nextMeetingId = findNextMeetingId(meetings)

  const { stats, completion, trend: activityTrend } = buildWeeklyStats(tasks)
  const { projects, totalProjects, trend: projectsTrend } = buildProjectsChart(tasks)
  const timeline = buildTimeline(tasks, timelinePeriod)

  const activeInProgress = tasks.find((t) => t.status === 'in_progress')

  const notificationCount =
    reminders.filter((r) => r.priority === 'high').length +
    todayMeetings.filter((m) => m.status === 'scheduled').length

  return {
    tasks: todayTasks.map((t) =>
      mapTaskToDashboard(t, featuredTask?.id === t.id)
    ),
    meetings: todayMeetings.map((m) =>
      mapMeetingToDashboard(m, m.id === nextMeetingId)
    ),
    reminders: reminders.slice(0, 5).map(mapReminderToDashboard),
    stats,
    completion,
    activityTrend,
    projects,
    totalProjects,
    projectsTrend,
    timeline,
    activeTask: activeInProgress
      ? {
          title: activeInProgress.title,
          subtitle: activeInProgress.project?.name ?? 'General',
        }
      : featuredTask
        ? {
            title: featuredTask.title,
            subtitle: featuredTask.project?.name ?? 'General',
          }
        : null,
    notificationCount,
    notifications: [
      ...reminders
        .filter((r) => r.priority === 'high')
        .slice(0, 5)
        .map((r) => ({
          id: `reminder-${r.id}`,
          title: r.title,
          subtitle: format(r.scheduledAt, 'EEE, hh:mm a'),
          type: 'reminder' as const,
        })),
      ...todayMeetings
        .filter((m) => m.status === 'scheduled')
        .slice(0, 5)
        .map((m) => ({
          id: `meeting-${m.id}`,
          title: m.title,
          subtitle: formatMeetingSubtitle(m.startTime),
          type: 'meeting' as const,
        })),
    ],
  }
}

function formatMeetingSubtitle(startTime: Date): string {
  return format(startTime, 'EEE, hh:mm a')
}
