import { Role } from '@prisma/client'

export type DashboardLayout = 'developer' | 'standard'

export type RoleDashboardConfig = {
  layout: DashboardLayout
  title?: string
  subtitle?: string
}

export const ROLE_DASHBOARD_CONFIG: Record<Role, RoleDashboardConfig> = {
  [Role.ADMIN]: {
    layout: 'standard',
    title: 'Admin Dashboard',
    subtitle: 'Create projects and control organization execution',
  },
  [Role.DEVELOPER]: {
    layout: 'developer',
  },
  [Role.TEAM_LEAD]: {
    layout: 'standard',
    title: 'Team Lead Dashboard',
    subtitle: "Oversee your team's progress and manage project execution",
  },
  [Role.SENIOR_MANAGER]: {
    layout: 'standard',
    title: 'Senior Manager Dashboard',
    subtitle: 'Organization-wide overview of projects and team performance',
  },
  [Role.PROJECT_LEAD]: {
    layout: 'standard',
    title: 'Project Lead Dashboard',
    subtitle: 'Track project milestones, resources, and deliverables',
  },
}
