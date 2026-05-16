'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Star } from 'lucide-react'

interface Task {
  id: string
  title: string
  project: string
  status: 'todo' | 'in_progress' | 'completed'
}

interface TasksListProps {
  tasks: Task[]
  count: number
}

const statusColors = {
  todo: 'bg-muted text-muted-foreground',
  in_progress: 'bg-primary/20 text-primary',
  completed: 'bg-green-500/20 text-green-400',
}

export function TasksList({ tasks, count }: TasksListProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Today&apos;s tasks</CardTitle>
          <CardDescription className="text-muted-foreground">{count}</CardDescription>
        </div>
        <a href="#" className="text-primary text-sm hover:underline">
          Manage →
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
            <Play className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-sm">{task.title}</div>
              <div className="text-xs text-muted-foreground">{task.project}</div>
            </div>
            <Star className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
