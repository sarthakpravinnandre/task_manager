'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import useSWR, { mutate } from 'swr'
import { useState, useEffect } from 'react'

type SettingsData = {
  theme: string
  notificationsEnabled: boolean
  user: {
    name: string | null
    email: string | null
    bio: string | null
    role: string
  }
}

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject()))

export function SettingsPageContent() {
  const { data, error, isLoading } = useSWR<SettingsData>('/api/settings', fetcher)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) {
      setName(data.user.name ?? '')
      setBio(data.user.bio ?? '')
      setNotificationsEnabled(data.notificationsEnabled)
    }
  }, [data])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, notificationsEnabled }),
      })
      await mutate('/api/settings')
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return <p className="text-red-400 text-center py-12">Failed to load settings.</p>
  }

  if (isLoading || !data) {
    return <p className="text-zinc-500">Loading settings...</p>
  }

  return (
    <div className="max-w-lg space-y-8">
      <section className="bg-[#121212] rounded-3xl border border-white/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <div className="space-y-2">
          <Label className="text-zinc-400">Email</Label>
          <Input value={data.user.email ?? ''} disabled className="bg-[#0a0a0a] border-white/10 text-zinc-500" />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-400">Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#0a0a0a] border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-400">Bio</Label>
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-[#0a0a0a] border-white/10 text-white"
          />
        </div>
        <p className="text-xs text-zinc-600">Role: {data.user.role.replace('_', ' ')}</p>
      </section>

      <section className="bg-[#121212] rounded-3xl border border-white/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Preferences</h2>
        <div className="flex items-center justify-between">
          <Label className="text-zinc-400">Notifications</Label>
          <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
        </div>
      </section>

      <Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-500">
        {saving ? 'Saving...' : 'Save changes'}
      </Button>
    </div>
  )
}
