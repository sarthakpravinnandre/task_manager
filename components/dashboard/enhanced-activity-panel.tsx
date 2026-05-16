'use client'

import { TrendingDown, TrendingUp, MoreVertical } from 'lucide-react'

interface Stat {
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
}

interface EnhancedActivityPanelProps {
  stats: Stat[]
  completion: number
  trend?: number
}

export function EnhancedActivityPanel({ stats, completion, trend = 0 }: EnhancedActivityPanelProps) {
  const isPositive = trend >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-zinc-400 text-sm font-medium">Activity</h3>
          {trend !== 0 && (
            <div
              className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                isPositive
                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                  : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}
            >
              {isPositive ? '+' : ''}
              {trend}% <TrendIcon className="w-2 h-2" />
            </div>
          )}
        </div>
        <button type="button" aria-label="Activity options" className="text-zinc-600 hover:text-zinc-400">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <p className="text-4xl font-bold text-white mb-8 tracking-tight">{completion}%</p>

      <div className="flex-1 flex items-end justify-between gap-2 px-1">
        {stats.length === 0 ? (
          <p className="text-zinc-500 text-sm w-full text-center py-8">No activity data yet</p>
        ) : (
          stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center flex-1">
              <div className="w-full relative group">
                <div
                  className="w-full bg-white/[0.03] rounded-md transition-all duration-500 group-hover:bg-white/[0.07]"
                  style={{ height: '140px' }}
                >
                  <div
                    className={`absolute bottom-0 w-full rounded-md transition-all duration-700 ${
                      stat.value > 80 ? 'bg-zinc-700' : stat.value > 0 ? 'bg-zinc-800' : 'bg-transparent'
                    }`}
                    style={{ height: `${stat.value}%` }}
                  />
                </div>
              </div>
              <div className="text-[10px] font-bold text-zinc-500 mt-3 mb-1 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className={`text-[10px] font-bold ${stat.value > 0 ? (stat.value > 80 ? 'text-white' : 'text-red-500/80') : 'text-zinc-700'}`}>
                {stat.value}%
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
