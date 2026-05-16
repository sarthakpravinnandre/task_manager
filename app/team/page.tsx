import { AppShell } from '@/components/app-shell'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function TeamPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <AppShell
      pageTitle="Team"
      title="Team"
      subtitle="Manage team members, roles, and collaboration settings"
    >
      <section className="bg-card rounded-[32px] border border-border p-8 shadow-xl">
        <p className="text-muted-foreground">
          Team management uses <code className="text-sm">/api/teams</code>. Team leads and admins can update teams from the dashboard Role Workspace.
        </p>
      </section>
    </AppShell>
  )
}
