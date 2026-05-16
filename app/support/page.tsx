import { AppShell } from '@/components/app-shell'
import { SupportPanel } from '@/components/support/support-panel'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function SupportPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <AppShell
      pageTitle="Support"
      title="Support"
      subtitle="Get help with your account and workspace"
    >
      <SupportPanel />
    </AppShell>
  )
}
