'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { RoleWorkspace } from '@/components/dashboard/role-workspace'

export function ProjectLeadDashboard() {
  return (
    <DashboardContent
      layout="standard"
      title="Project Lead Dashboard"
      subtitle="Track project milestones, resources, and deliverables"
      headerSlot={<RoleWorkspace />}
    />
  )
}
