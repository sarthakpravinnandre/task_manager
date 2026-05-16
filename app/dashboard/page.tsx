import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { DeveloperDashboard } from '@/components/dashboard/developer-dashboard'
import { TeamLeadDashboard } from '@/components/dashboard/team-lead-dashboard'
import { SeniorManagerDashboard } from '@/components/dashboard/senior-manager-dashboard'
import { ProjectLeadDashboard } from '@/components/dashboard/project-lead-dashboard'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  // Role is now available directly on the session user object
  const userRole = session.user.role?.toLowerCase() || 'developer'

  const getDashboardComponent = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />
      case 'developer':
        return <DeveloperDashboard />
      case 'team_lead':
        return <TeamLeadDashboard />
      case 'senior_manager':
        return <SeniorManagerDashboard />
      case 'project_lead':
        return <ProjectLeadDashboard />
      default:
        return <DeveloperDashboard />
    }
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <Sidebar />
      <Navbar />

      <main className="ml-20 pt-20 p-8">
        <div className="max-w-[1600px] mx-auto">
          {getDashboardComponent()}
        </div>
      </main>
    </div>
  )
}
