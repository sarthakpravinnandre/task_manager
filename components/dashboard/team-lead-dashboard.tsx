'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { RoleWorkspace } from '@/components/dashboard/role-workspace'

export function TeamLeadDashboard() {
  return (
    <DashboardContent
      layout="standard"
      title="Team Lead Dashboard"
      subtitle="Oversee your team's progress and manage project execution"
      headerSlot={<RoleWorkspace />}
    />
  )
}
