'use client'

import useSWR from 'swr'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type TeamRecord = {
  id: string
  name: string
  lead: { name: string | null; email: string | null } | null
  members: { id: string; name: string | null; email: string | null; role: string }[]
  projects: { id: string; name: string }[]
}

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject()))

export function TeamPageContent() {
  const { data: teams = [], error, isLoading } = useSWR<TeamRecord[]>('/api/teams', fetcher)

  if (error) {
    return <p className="text-red-400 text-center py-12">Failed to load teams.</p>
  }

  if (isLoading) {
    return <p className="text-zinc-500">Loading teams...</p>
  }

  if (teams.length === 0) {
    return <p className="text-zinc-500 text-center py-12">No teams found for your role.</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {teams.map((team) => (
        <div key={team.id} className="bg-[#121212] rounded-3xl border border-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-1">{team.name}</h2>
          {team.lead && (
            <p className="text-sm text-zinc-500 mb-4">
              Lead: {team.lead.name ?? team.lead.email}
            </p>
          )}
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">
            Members ({team.members.length})
          </p>
          <div className="space-y-2 mb-6">
            {team.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {(member.name ?? member.email ?? 'U').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{member.name ?? member.email}</p>
                  <p className="text-xs text-zinc-500">{member.role.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
          {team.projects.length > 0 && (
            <>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Projects</p>
              <div className="flex flex-wrap gap-2">
                {team.projects.map((p) => (
                  <span key={p.id} className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {p.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
