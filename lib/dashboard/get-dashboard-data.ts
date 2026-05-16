import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'
import type { DashboardData } from './types'
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

function normalizeRole(role?: string | null): Role {
  const key = (role ?? 'DEVELOPER').toUpperCase().replace(/-/g, '_')
  const map: Record<string, Role> = {
    ADMIN: Role.ADMIN,
    DEVELOPER: Role.DEVELOPER,
    TEAM_LEAD: Role.TEAM_LEAD,
    SENIOR_MANAGER: Role.SENIOR_MANAGER,
    PROJECT_LEAD: Role.PROJECT_LEAD,
  }
  return map[key] ?? Role.DEVELOPER
}

async function getUserIdsForScope(
  userId: string,
  role: Role,
  teamId: string | null | undefined
): Promise<string[]> {
  switch (role) {
    case Role.TEAM_LEAD:
    case Role.PROJECT_LEAD:
      if (!teamId) return [userId]
      {
        const members = await prisma.user.findMany({
          where: { teamId },
          select: { id: true },
        })
        return members.length > 0 ? members.map((m) => m.id) : [userId]
      }
    case Role.SENIOR_MANAGER:
    case Role.ADMIN: {
      const all = await prisma.user.findMany({ select: { id: true } })
      return all.map((u) => u.id)
    }
    default:
      return [userId]
  }
}

export async function getDashboardData(
  userId: string,
  role: string | null | undefined,
  teamId: string | null | undefined
): Promise<DashboardData> {
  const normalizedRole = normalizeRole(role)
  const userIds = await getUserIdsForScope(userId, normalizedRole, teamId)

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
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const todayTasks = filterTodayTasks(tasks)
  const featuredTask = todayTasks.find((t) => t.status === 'in_progress') ?? todayTasks[0]
  const todayMeetings = filterTodayMeetings(meetings)
  const nextMeetingId = findNextMeetingId(meetings)

  const { stats, completion, trend: activityTrend } = buildWeeklyStats(tasks)
  const { projects, totalProjects, trend: projectsTrend } = buildProjectsChart(tasks)
  const timeline = buildTimeline(tasks)

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
  }
}
