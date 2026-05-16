'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Clock } from 'lucide-react'

interface Reminder {
  id: string
  title: string
  time: string
  priority: 'low' | 'high'
}

interface RemindersProps {
  reminders: Reminder[]
}

export function Reminders({ reminders }: RemindersProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Reminders</CardTitle>
        </div>
        <a href="#" className="text-primary text-sm hover:underline">
          Manage →
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
            {reminder.priority === 'high' ? (
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-sm">{reminder.title}</div>
              <div className="text-xs text-muted-foreground">{reminder.time}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
