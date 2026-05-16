'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useSWR, { mutate } from 'swr'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

type MessageRecord = {
  id: string
  content: string
  createdAt: string
  sender: { id: string; name: string | null; email: string | null }
  receiver?: { id: string; name: string | null } | null
}

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject()))

export function MessagesPageContent() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const { data: messages = [], error, isLoading } = useSWR<MessageRecord[]>('/api/messages', fetcher)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  const sendMessage = async () => {
    if (!content.trim()) return
    setSending(true)
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), teamId: null }),
      })
      setContent('')
      await mutate('/api/messages')
    } finally {
      setSending(false)
    }
  }

  if (error) {
    return <p className="text-red-400 text-center py-12">Failed to load messages.</p>
  }

  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[700px] bg-[#121212] rounded-3xl border border-white/5 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <p className="text-zinc-500 text-center">Loading messages...</p>
        ) : sorted.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">No messages yet. Start the conversation.</p>
        ) : (
          sorted.map((msg) => {
            const isOwn = msg.sender.id === userId
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isOwn ? 'bg-blue-600/20 border border-blue-500/20' : 'bg-white/[0.03] border border-white/5'}`}>
                  <p className="text-sm text-white">{msg.content}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {msg.sender.name ?? msg.sender.email} · {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="p-4 border-t border-white/5 flex gap-3">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="bg-[#0a0a0a] border-white/10 text-white"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={sending} className="bg-blue-600 hover:bg-blue-500 shrink-0">
          Send
        </Button>
      </div>
    </div>
  )
}
