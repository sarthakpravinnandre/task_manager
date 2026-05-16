import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function TeamPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <Sidebar />
      <Navbar />

      <main className="ml-20 pt-20 p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Team</h1>
            <p className="text-zinc-500 mt-1">Manage team members, roles, and collaboration settings</p>
          </div>

          <div className="bg-[#121212] rounded-[32px] border border-white/5 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Team Members</h2>
            <p className="text-zinc-500">Team management features are being enhanced to match the new design...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
