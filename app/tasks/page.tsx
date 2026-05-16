import { AppShell } from '@/components/app-shell'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function TasksPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <AppShell
      pageTitle="Tasks"
      title="Tasks"
      subtitle="Manage your project tasks and stay productive"
    >
      <section className="bg-card rounded-[32px] border border-border p-8 shadow-xl">
        <p className="text-muted-foreground">
          Full task management UI is coming next. Use the dashboard to update today&apos;s tasks, or the API at{' '}
          <code className="text-sm">/api/tasks</code> for programmatic access.
        </p>
      </section>
    </AppShell>
  )
}
