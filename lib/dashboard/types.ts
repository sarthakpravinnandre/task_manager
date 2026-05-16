export interface DashboardTask {
  id: string
  title: string
  project: string
  status: 'todo' | 'in_progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  featured?: boolean
}

export interface DashboardMeeting {
  id: string
  title: string
  time: string
  duration: string
  attendees: number
  status: 'scheduled' | 'ongoing' | 'completed'
  highlighted?: boolean
}

export interface DashboardReminder {
  id: string
  title: string
  time: string
  priority: 'low' | 'medium' | 'high'
}

export interface DashboardStat {
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
}

export interface DashboardProject {
  name: string
  percentage: number
  color: string
  count: number
}

export interface TimelineProject {
  id: string
  name: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'done'
  status: 'todo' | 'in_progress' | 'completed'
  time?: string
}

export interface TimelineDay {
  day: string
  date: number
  month?: number
  projects: TimelineProject[]
}

export type TimelinePeriod = 'today' | 'week' | 'month' | 'year'

export interface DashboardNotification {
  id: string
  title: string
  subtitle: string
  type: 'reminder' | 'meeting'
}

export interface DashboardData {
  tasks: DashboardTask[]
  meetings: DashboardMeeting[]
  reminders: DashboardReminder[]
  stats: DashboardStat[]
  completion: number
  activityTrend: number
  projects: DashboardProject[]
  totalProjects: number
  projectsTrend: number
  timeline: TimelineDay[]
  activeTask: { title: string; subtitle: string } | null
  notificationCount: number
  notifications: DashboardNotification[]
}
