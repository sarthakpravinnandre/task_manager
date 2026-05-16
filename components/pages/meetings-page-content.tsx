'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useSWR, { mutate } from 'swr'
import { format } from 'date-fns'
import { useState } from 'react'

type MeetingRecord = {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  attendees: number
  status: string
  user: { name: string | null }
}

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject()))

export function MeetingsPageContent() {
  const { data: meetings = [], error, isLoading } = useSWR<MeetingRecord[]>('/api/meetings', fetcher)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const createMeeting = async () => {
    if (!title.trim()) return
    setSaving(true)
    const start = new Date()
    start.setMinutes(0, 0, 0)
    start.setHours(start.getHours() + 1)
    const end = new Date(start)
    end.setHours(end.getHours() + 1)
    try {
      await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }),
      })
      setTitle('')
      await mutate('/api/meetings')
    } finally {
      setSaving(false)
    }
  }

  const deleteMeeting = async (id: string) => {
    await fetch(`/api/meetings?id=${id}`, { method: 'DELETE' })
    await mutate('/api/meetings')
  }

  if (error) {
    return <p className="text-red-400 text-center py-12">Failed to load meetings.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting title..."
          className="bg-[#121212] border-white/10 text-white max-w-md"
          onKeyDown={(e) => e.key === 'Enter' && createMeeting()}
        />
        <Button onClick={createMeeting} disabled={saving} className="bg-blue-600 hover:bg-blue-500">
          Schedule
        </Button>
      </div>

      {isLoading ? (
        <p className="text-zinc-500">Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <p className="text-zinc-500 text-center py-12">No meetings scheduled.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting) => {
            const period = format(new Date(meeting.startTime), 'a').toUpperCase()
            const time = format(new Date(meeting.startTime), 'hh:mm')
            return (
              <div key={meeting.id} className="p-5 rounded-2xl bg-[#121212] border border-white/5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{period}</span>
                    <p className="text-2xl font-bold text-white">{time}</p>
                  </div>
                  <span className="text-xs text-zinc-500 capitalize">{meeting.status}</span>
                </div>
                <p className="text-white font-medium mb-1">{meeting.title}</p>
                <p className="text-xs text-zinc-500 mb-4">
                  {format(new Date(meeting.startTime), 'EEE, MMM d')}
                  {meeting.user?.name ? ` · ${meeting.user.name}` : ''}
                </p>
                <Button variant="ghost" size="sm" className="text-red-400" onClick={() => deleteMeeting(meeting.id)}>
                  Cancel
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
