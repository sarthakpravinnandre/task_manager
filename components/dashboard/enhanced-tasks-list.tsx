'use client'

import { Button } from '@/components/ui/button'
import { Play, Star, Pause } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { mutate } from 'swr'

interface Task {
  id: string
  title: string
  project: string
  status: 'todo' | 'in_progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  featured?: boolean
}

interface EnhancedTasksListProps {
  tasks: Task[]
  count: number
  interactive?: boolean
}

export function EnhancedTasksList({ tasks, count, interactive = true }: EnhancedTasksListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [starred, setStarred] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tasks.filter((t) => t.featured || t.priority === 'high').map((t) => [t.id, true]))
  )

  const updateTask = async (id: string, updates: { status?: string; priority?: string }) => {
    if (!interactive) return
    setUpdatingId(id)
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!res.ok) throw new Error('Failed to update task')
      await mutate('/api/dashboard')
      await mutate('/api/tasks')
    } finally {
      setUpdatingId(null)
    }
  }

  const toggleStatus = (task: Task) => {
    const next =
      task.status === 'todo'
        ? 'in_progress'
        : task.status === 'in_progress'
          ? 'completed'
          : 'todo'
    void updateTask(task.id, { status: next })
  }

  const toggleStar = (task: Task) => {
    const isStarred = starred[task.id]
    setStarred((prev) => ({ ...prev, [task.id]: !isStarred }))
    void updateTask(task.id, { priority: !isStarred ? 'high' : 'medium' })
  }

  return (
    <div className="bg-card border border-border rounded-[32px] p-6 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white tracking-tight">Today&apos;s tasks</h2>
          <span className="bg-white/5 text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-md border border-white/5">
            {count}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 text-sm font-medium" asChild>
          <Link href="/tasks">Manage &gt;</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-6">No tasks for today</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300"
          >
            <button
              type="button"
              disabled={!interactive || updatingId === task.id}
              onClick={() => toggleStatus(task)}
              aria-label={task.status === 'in_progress' ? 'Pause task' : 'Start task'}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 disabled:opacity-50 ${
                task.status === 'in_progress' ? 'bg-orange-600/20 text-orange-500' : 'bg-blue-600/20 text-blue-500'
              }`}
            >
              {task.status === 'in_progress' ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <Link href={`/tasks?highlight=${task.id}`} className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate hover:text-blue-400 transition-colors">{task.title}</div>
              <div className="text-xs text-blue-500 font-medium mt-0.5">{task.project}</div>
            </Link>

            <button
              type="button"
              disabled={!interactive || updatingId === task.id}
              onClick={() => toggleStar(task)}
              aria-label={starred[task.id] ? 'Unstar task' : 'Star task'}
              className="text-zinc-600 hover:text-yellow-500 transition-colors disabled:opacity-50"
            >
              <Star className={`w-5 h-5 ${starred[task.id] ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
