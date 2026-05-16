import { AppShell } from '@/components/app-shell'
import { RoleDashboard } from '@/components/dashboard/role-dashboard'
import { auth } from '@/auth'
import { normalizeRole } from '@/lib/auth/roles'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const userRole = normalizeRole(session.user.role)

  return (
    <AppShell pageTitle="Dashboard">
      <RoleDashboard role={userRole} />
    </AppShell>
  )
}
