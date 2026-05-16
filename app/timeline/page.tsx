import { AppShell } from '@/components/app-shell'
import { TimelinePageContent } from '@/components/timeline/timeline-page-content'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function TimelinePage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <AppShell
      pageTitle="Timeline"
      title="Timeline"
      subtitle="Track project progress over time"
    >
      <TimelinePageContent />
    </AppShell>
  )
}
