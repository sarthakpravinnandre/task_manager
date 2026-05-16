import { AppShell } from '@/components/app-shell'
import { MessagesPanel } from '@/components/messages/messages-panel'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <AppShell
      pageTitle="Messages"
      title="Messages"
      subtitle="Communicate with your team members"
    >
      <MessagesPanel />
    </AppShell>
  )
}
