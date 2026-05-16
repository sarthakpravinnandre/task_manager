'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { RoleWorkspace } from '@/components/dashboard/role-workspace'

export function SeniorManagerDashboard() {
  return (
    <DashboardContent
      layout="standard"
      title="Senior Manager Dashboard"
      subtitle="Organization-wide overview of projects and team performance"
      headerSlot={<RoleWorkspace />}
    />
  )
}
