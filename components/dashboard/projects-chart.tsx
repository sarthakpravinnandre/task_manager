'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { TrendingDown, TrendingUp, MoreVertical } from 'lucide-react'

interface Project {
  name: string
  percentage: number
  color: string
  count: number
}

interface ProjectsChartProps {
  projects: Project[]
  totalProjects: number
  trend?: number
}

export function ProjectsChart({ projects, totalProjects, trend = 0 }: ProjectsChartProps) {
  const data = projects.map((p) => ({
    name: p.name,
    value: p.percentage,
    color: p.color,
  }))
  const isPositive = trend >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-zinc-400 text-sm font-medium">Projects worked</h3>
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
        <button type="button" aria-label="Projects chart options" className="text-zinc-600 hover:text-zinc-400">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-12">No projects yet</p>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">{totalProjects}</span>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">projects</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {projects.map((project) => (
              <div key={project.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
                  <span className="text-xs text-zinc-400 truncate">{project.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{project.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
