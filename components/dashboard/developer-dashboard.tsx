'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { RoleWorkspace } from '@/components/dashboard/role-workspace'

export function DeveloperDashboard() {
  return <DashboardContent layout="developer" headerSlot={<RoleWorkspace />} />
}
