import { AppShell } from '@/components/app-shell'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <AppShell
      pageTitle="Settings"
      title="Settings"
      subtitle="Manage your account preferences and application settings"
    >
      <section className="bg-card rounded-[32px] border border-border p-8 shadow-xl space-y-2">
        <p className="text-muted-foreground">
          Use the navbar theme toggle for light/dark mode. Account email:{' '}
          <span className="text-foreground">{session.user.email}</span>
        </p>
        <p className="text-muted-foreground text-sm">
          Role: {session.user.role ?? 'DEVELOPER'}
        </p>
      </section>
    </AppShell>
  )
}
