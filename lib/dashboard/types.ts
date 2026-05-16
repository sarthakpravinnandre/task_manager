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
}

export interface TimelineDay {
  day: string
  date: number
  projects: TimelineProject[]
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
}
