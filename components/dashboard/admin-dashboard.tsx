'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { RoleWorkspace } from '@/components/dashboard/role-workspace'

export function AdminDashboard() {
  return (
    <DashboardContent
      layout="standard"
      title="Admin Dashboard"
      subtitle="Create projects and control organization execution"
      headerSlot={<RoleWorkspace />}
    />
  )
}
