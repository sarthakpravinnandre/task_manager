'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useSWR, { mutate } from 'swr'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

type TaskRecord = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  project: { name: string } | null
  user: { name: string | null; email: string | null }
}

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject()))

const statusColors: Record<string, string> = {
  todo: 'bg-zinc-500/20 text-zinc-400',
  in_progress: 'bg-orange-500/20 text-orange-400',
  completed: 'bg-green-500/20 text-green-400',
}

export function TasksPageContent() {
  const searchParams = useSearchParams()
  const highlight = searchParams.get('highlight')
  const { data: tasks = [], error, isLoading } = useSWR<TaskRecord[]>('/api/tasks', fetcher)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const createTask = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })
      setTitle('')
      await mutate('/api/tasks')
    } finally {
      setSaving(false)
    }
  }

  const cycleStatus = async (task: TaskRecord) => {
    const next =
      task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'todo'
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, status: next }),
    })
    await mutate('/api/tasks')
  }

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
    await mutate('/api/tasks')
  }

  if (error) {
    return <p className="text-red-400 text-center py-12">Failed to load tasks.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title..."
          className="bg-[#121212] border-white/10 text-white max-w-md"
          onKeyDown={(e) => e.key === 'Enter' && createTask()}
        />
        <Button onClick={createTask} disabled={saving} className="bg-blue-600 hover:bg-blue-500">
          Add task
        </Button>
      </div>

      {isLoading ? (
        <p className="text-zinc-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-zinc-500 text-center py-12">No tasks yet. Create one above.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              id={task.id}
              className={`flex items-center gap-4 p-4 rounded-2xl bg-[#121212] border transition-colors ${
                highlight === task.id ? 'border-blue-500/50' : 'border-white/5'
              }`}
            >
              <button
                type="button"
                onClick={() => cycleStatus(task)}
                className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${statusColors[task.status] ?? statusColors.todo}`}
              >
                {task.status.replace('_', ' ')}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{task.title}</p>
                <p className="text-xs text-zinc-500">
                  {task.project?.name ?? 'General'}
                  {task.user?.name ? ` · ${task.user.name}` : ''}
                  {task.dueDate ? ` · Due ${format(new Date(task.dueDate), 'MMM d')}` : ''}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => deleteTask(task.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
