'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useMessages } from '@/hooks/use-dashboard'
import { useState } from 'react'

type MessageRow = {
  id: string
  content: string
  createdAt: string
  sender?: { name?: string | null; email?: string | null }
}

export function MessagesPanel() {
  const { messages, isLoading, error, mutate } = useMessages()
  const list = messages as MessageRow[]
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const sendMessage = async () => {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }
      setContent('')
      mutate()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-card rounded-[32px] border border-border p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-semibold">Send a message</h2>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write to your team…"
          aria-label="Message content"
          rows={3}
        />
        <Button onClick={sendMessage} disabled={submitting || !content.trim()}>
          {submitting ? 'Sending…' : 'Send'}
        </Button>
      </section>

      <section className="bg-card rounded-[32px] border border-border p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Recent messages</h2>
        {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
        {error && <p className="text-destructive text-sm">Failed to load messages.</p>}
        {!isLoading && list.length === 0 && (
          <p className="text-muted-foreground text-sm">No messages yet.</p>
        )}
        <ul className="space-y-3 max-h-[480px] overflow-y-auto">
          {list.map((msg) => (
            <li key={msg.id} className="border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">
                {msg.sender?.name || msg.sender?.email || 'Unknown'}
              </p>
              <p className="text-sm">{msg.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
