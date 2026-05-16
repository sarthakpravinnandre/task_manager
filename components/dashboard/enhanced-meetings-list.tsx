'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Video, MoreHorizontal } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  time: string
  duration: string
  attendees: number
  status: 'scheduled' | 'ongoing' | 'completed'
  highlighted?: boolean
}

interface EnhancedMeetingsListProps {
  meetings: Meeting[]
  count: number
}

export function EnhancedMeetingsList({ meetings, count }: EnhancedMeetingsListProps) {
  return (
    <div className="bg-[#121212] border border-white/5 rounded-[32px] p-6 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white tracking-tight">Today&apos;s meetings</h2>
          <span className="bg-white/5 text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-md border border-white/5">
            {count}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 text-sm font-medium">
          View all &gt;
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {meetings.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-6 col-span-2">No meetings today</p>
        )}
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className={`group p-4 rounded-2xl border transition-all duration-300 ${
              meeting.highlighted
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-white/[0.03] border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">AM</span>
                <span className={`text-xl font-bold ${meeting.highlighted ? 'text-red-500' : 'text-white'}`}>
                  {meeting.time.split(' ')[0]}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                meeting.highlighted ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-zinc-400'
              }`}>
                <Video className="w-5 h-5" />
              </div>
            </div>
            
            <div className={`text-sm font-medium leading-tight ${meeting.highlighted ? 'text-zinc-300' : 'text-zinc-400'}`}>
              {meeting.title}
            </div>
          </div>
        ))}

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.05] transition-colors">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <span className="text-2xl font-light">+</span>
          </div>
          <span className="text-xs font-medium text-blue-500">Schedule meeting</span>
        </div>
      </div>
    </div>
  )
}
