'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Star, Pause } from 'lucide-react'

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
}

export function EnhancedTasksList({ tasks, count }: EnhancedTasksListProps) {
  return (
    <div className="bg-[#121212] border border-white/5 rounded-[32px] p-6 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white tracking-tight">Today&apos;s tasks</h2>
          <span className="bg-white/5 text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-md border border-white/5">
            {count}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 text-sm font-medium">
          Manage &gt;
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
              task.status === 'in_progress' ? 'bg-orange-600/20 text-orange-500' : 'bg-blue-600/20 text-blue-500'
            }`}>
              {task.status === 'in_progress' ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{task.title}</div>
              <div className="text-xs text-blue-500 font-medium mt-0.5">{task.project}</div>
            </div>

            <button className="text-zinc-600 hover:text-yellow-500 transition-colors">
              <Star className={`w-5 h-5 ${task.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
