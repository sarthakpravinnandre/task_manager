import { AppShell } from '@/components/app-shell'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function MeetingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <AppShell
      pageTitle="Meetings"
      title="Meetings"
      subtitle="Schedule and manage your team collaboration sessions"
    >
      <section className="bg-card rounded-[32px] border border-border p-8 shadow-xl">
        <p className="text-muted-foreground">
          Meeting scheduling UI is in progress. Create meetings via{' '}
          <code className="text-sm">POST /api/meetings</code> or view today&apos;s meetings on the dashboard.
        </p>
      </section>
    </AppShell>
  )
}
