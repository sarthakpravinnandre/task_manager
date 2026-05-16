'use client'

import { Mic2 } from 'lucide-react'
import { useVoiceChannels } from '@/hooks/use-dashboard'

type VoiceChannelRow = {
  id: string
  name: string
  team?: { name: string } | null
  project?: { name: string } | null
}

export function VoicePanel() {
  const { channels, isLoading, error } = useVoiceChannels()
  const list = channels as VoiceChannelRow[]

  return (
    <section className="bg-card rounded-[32px] border border-border p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Voice channels</h2>
      {isLoading && <p className="text-muted-foreground text-sm">Loading channels…</p>}
      {error && <p className="text-destructive text-sm">Failed to load voice channels.</p>}
      {!isLoading && list.length === 0 && (
        <p className="text-muted-foreground text-sm">No voice channels available for your team.</p>
      )}
      <ul className="space-y-3">
        {list.map((channel) => (
          <li
            key={channel.id}
            className="flex items-center gap-3 border border-border rounded-xl p-4"
          >
            <span
              className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0"
              aria-hidden
            >
              <Mic2 className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-medium">{channel.name}</span>
              <span className="block text-xs text-muted-foreground">
                {channel.team?.name ?? 'Organization'}
                {channel.project?.name ? ` · ${channel.project.name}` : ''}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
