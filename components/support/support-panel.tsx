'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSupportTickets } from '@/hooks/use-dashboard'
import { useState } from 'react'

export function SupportPanel() {
  const { tickets, isLoading, error, mutate } = useSupportTickets()
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submitTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      setMessage('Subject and description are required.')
      return
    }
    setSubmitting(true)
    setMessage('')
    try {
      const res = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit ticket')
      setSubject('')
      setDescription('')
      setMessage('Ticket submitted successfully.')
      mutate()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to submit ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-[32px] border border-border p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-semibold">New support ticket</h2>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          aria-label="Ticket subject"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue"
          aria-label="Ticket description"
          rows={4}
        />
        <Button onClick={submitTicket} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit ticket'}
        </Button>
        {message && <p className="text-sm text-blue-400">{message}</p>}
      </div>

      <div className="bg-card rounded-[32px] border border-border p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Your tickets</h2>
        {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
        {error && <p className="text-destructive text-sm">Failed to load tickets.</p>}
        {!isLoading && tickets.length === 0 && (
          <p className="text-muted-foreground text-sm">No tickets yet.</p>
        )}
        <ul className="space-y-3">
          {tickets.map((ticket: { id: string; subject: string; status: string; description: string }) => (
            <li key={ticket.id} className="border border-border rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-medium">{ticket.subject}</p>
                <span className="text-xs uppercase text-muted-foreground">{ticket.status}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
