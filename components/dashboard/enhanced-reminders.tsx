'use client'

import { Button } from '@/components/ui/button'

interface Reminder {
  id: string
  title: string
  time: string
  priority: 'low' | 'medium' | 'high'
}

interface EnhancedRemindersProps {
  reminders: Reminder[]
}

const priorityColors = {
  low: 'text-green-500 bg-green-500',
  medium: 'text-orange-500 bg-orange-500',
  high: 'text-orange-600 bg-orange-600',
}

export function EnhancedReminders({ reminders }: EnhancedRemindersProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white tracking-tight">Reminders</h3>
        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 text-sm font-medium">
          Manage &gt;
        </Button>
      </div>

      <div className="space-y-4">
        {reminders.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-6">No reminders</p>
        )}
        {reminders.map((reminder) => (
          <div 
            key={reminder.id} 
            className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300"
          >
            <div className="flex flex-col">
              <div className="text-xl font-bold text-white tracking-tight leading-none mb-1">
                {reminder.time.split(' ')[0]} <span className="text-xs font-bold text-zinc-500 ml-0.5">{reminder.time.split(' ')[1]}</span>
              </div>
              <div className="text-xs text-zinc-500 font-medium">{reminder.title}</div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${reminder.priority === 'low' ? 'text-green-500' : 'text-orange-600'}`}>
                {reminder.priority}
              </span>
              <div className={`w-2 h-2 rounded-full ${priorityColors[reminder.priority]}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
