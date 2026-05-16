'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { RoleWorkspace } from '@/components/dashboard/role-workspace'
import { ROLE_DASHBOARD_CONFIG } from '@/lib/dashboard/role-config'
import { Role } from '@prisma/client'

interface RoleDashboardProps {
  role: Role
}

export function RoleDashboard({ role }: RoleDashboardProps) {
  const config = ROLE_DASHBOARD_CONFIG[role] ?? ROLE_DASHBOARD_CONFIG[Role.DEVELOPER]

  return (
    <DashboardContent
      layout={config.layout}
      title={config.title}
      subtitle={config.subtitle}
      headerSlot={<RoleWorkspace />}
    />
  )
}
