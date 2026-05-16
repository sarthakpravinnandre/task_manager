'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Clock, MessageSquare, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface TimelineProject {
  id: string
  name: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'done'
  status: 'todo' | 'in_progress' | 'completed'
  time?: string
  comments?: number
  members?: string[]
}

interface TimelineDay {
  day: string
  date: number
  projects: TimelineProject[]
}

interface TimelineViewProps {
  days: TimelineDay[]
}

const priorityColors = {
  done: 'text-zinc-500 bg-zinc-500',
  low: 'text-green-500 bg-green-500',
  medium: 'text-orange-500 bg-orange-500',
  high: 'text-red-500 bg-red-500',
}

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '01:00']

export function TimelineView({ days }: TimelineViewProps) {
  const [currentTimePos, setCurrentTimePos] = useState<number | null>(null)
  const [currentTimeLabel, setCurrentTimeLabel] = useState<string>('')

  useEffect(() => {
    const calculatePosition = () => {
      const now = new Date()
      const hour = now.getHours()
      const minutes = now.getMinutes()
      
      // Start time is 9:00 AM (9 in 24h)
      // End time is 1:00 PM (13 in 24h)
      const startHour = 9
      const endHour = 13
      
      const totalMinutes = (endHour - startHour) * 60
      const currentMinutes = (hour - startHour) * 60 + minutes
      
      if (currentMinutes >= 0 && currentMinutes <= totalMinutes) {
        // The grid header is 14px (h-14) + some padding? 
        // Actually the time labels start after pt-14. 
        // Each timeSlot is h-28 (112px).
        // Let's approximate based on the image: 10:28 was at ~170px.
        // 9:00 is at 56px (pt-14). 10:00 is at 56 + 112 = 168px.
        // So 10:28 is roughly 168 + (28/60 * 112) = 168 + 52 = 220px.
        const position = 56 + (currentMinutes / 60) * 112
        setCurrentTimePos(position)
        setCurrentTimeLabel(`${hour % 12 || 12}:${minutes.toString().padStart(2, '0')}`)
      }
    }

    calculatePosition()
    const interval = setInterval(calculatePosition, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#121212] rounded-[32px] overflow-hidden flex flex-col h-full border border-white/5">
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white tracking-tight">Projects</h2>
          <Button variant="ghost" size="sm" className="bg-white/5 text-zinc-400 rounded-full h-8 px-3 gap-2 border border-white/5">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs">Filter</span>
          </Button>
        </div>
        
        <div className="bg-white/5 rounded-full p-1 flex items-center">
          {['Today', 'Week', 'Month', 'Year'].map((period) => (
            <Button
              key={period}
              variant="ghost"
              size="sm"
              className={`rounded-full h-8 px-4 text-xs font-medium transition-all ${
                period === 'Week' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 overflow-x-auto pb-4">
        {/* Time Labels Column */}
        <div className="flex flex-col border-r border-white/5 pt-14">
          {timeSlots.map((time) => (
            <div key={time} className="h-28 px-4 text-[10px] font-bold text-zinc-600 flex items-start justify-center">
              {time}
            </div>
          ))}
        </div>

        {/* Current Time Line */}
        {currentTimePos !== null && (
          <div 
            className="absolute left-0 right-0 h-[1px] bg-red-500/50 z-20 flex items-center transition-all duration-1000"
            style={{ top: `${currentTimePos}px` }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full -ml-1"></div>
            <div className="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-bold rounded border border-red-500/20 backdrop-blur-sm">
              {currentTimeLabel}
            </div>
          </div>
        )}

        {/* Days Columns */}
        <div className="flex flex-1 min-w-[800px]">
          {days.map((day) => (
            <div key={day.day} className="flex-1 border-r border-white/5 min-w-[160px]">
              <div className="h-14 flex items-center justify-start px-4 border-b border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                  {day.day} <span className="text-white ml-1">{day.date}</span>
                </span>
              </div>
              
              <div className="p-3 space-y-4">
                {day.projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
                      project.status === 'completed' 
                        ? 'bg-zinc-900/50 border-white/5 opacity-80' 
                        : project.status === 'in_progress'
                        ? 'bg-orange-500/5 border-orange-500/20'
                        : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[project.priority as keyof typeof priorityColors] || 'bg-blue-500'}`}></div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                        {project.priority === 'done' ? 'Done' : project.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2 mb-3">
                        {project.description}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <Avatar key={i} className="w-5 h-5 border-2 border-[#121212]">
                            <AvatarImage src={`https://i.pravatar.cc/100?u=${project.id}${i}`} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="w-5 h-5 rounded-full bg-zinc-800 border-2 border-[#121212] flex items-center justify-center text-[8px] font-bold text-zinc-400">
                          +2
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-zinc-500">
                        {project.time && (
                          <div className="flex items-center gap-0.5 text-[10px]">
                            <Clock className="w-2.5 h-2.5" />
                            {project.time}
                          </div>
                        )}
                        {project.comments && (
                          <div className="flex items-center gap-0.5 text-[10px]">
                            <MessageSquare className="w-2.5 h-2.5" />
                            {project.comments}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {day.day === 'MON' && (
                  <div className="pt-20">
                    <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest pl-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                      Brake time
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
