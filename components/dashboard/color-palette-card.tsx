'use client'

import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface ColorPaletteCardProps {
  title: string
  subtitle: string
  isPlaying?: boolean
}

export function ColorPaletteCard({ title, subtitle, isPlaying: initialIsPlaying = false }: ColorPaletteCardProps) {
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    setSeconds(0)
    setIsPlaying(initialIsPlaying)
  }, [title, initialIsPlaying])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-card border border-border rounded-[32px] p-6 flex flex-col justify-between shadow-xl">
      <div>
        <div className="text-xl font-semibold text-white tracking-tight">{title}</div>
        <div className="text-zinc-500 text-sm mt-1">{subtitle}</div>
      </div>

      <div className="flex flex-col items-center justify-center my-8">
        <div className="relative group">
          <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${
            isPlaying ? 'bg-orange-600/30' : 'bg-orange-600/10'
          }`}></div>
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center relative z-10 shadow-lg border-4 border-orange-400/20 transition-transform ${
            isPlaying ? 'scale-105 shadow-orange-900/60' : 'scale-100 shadow-orange-900/40'
          }`}>
            <Button
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full bg-white/10 hover:bg-white/20 w-16 h-16 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              {isPlaying ? <Pause className="w-8 h-8 text-white fill-white" /> : <Play className="w-8 h-8 text-white fill-white ml-1" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/[0.03] rounded-2xl p-3 border border-white/5">
          <div className="text-zinc-500 text-xs uppercase tracking-wider font-medium mb-1">Today</div>
          <div className="text-lg font-mono font-semibold text-white tracking-wider">{formatTime(seconds)}</div>
        </div>
        <div className="bg-white/[0.03] rounded-2xl p-3 border border-white/5 text-right">
          <div className="text-zinc-500 text-xs uppercase tracking-wider font-medium mb-1">Limits</div>
          <div className="text-lg font-mono font-semibold text-white tracking-wider">06:00:00</div>
        </div>
      </div>
    </div>
  )
}
