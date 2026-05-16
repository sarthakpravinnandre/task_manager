import { AppShell } from '@/components/app-shell'
import { VoicePanel } from '@/components/voice/voice-panel'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function VoicePage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <AppShell
      pageTitle="Voice"
      title="Voice channels"
      subtitle="Team and project voice rooms"
    >
      <VoicePanel />
    </AppShell>
  )
}
