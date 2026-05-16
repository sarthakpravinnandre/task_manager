'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface ActivityStat {
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
}

interface ActivityPanelProps {
  stats: ActivityStat[]
  completion: number
}

export function ActivityPanel({ stats, completion }: ActivityPanelProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Activity</CardTitle>
            <CardDescription className="text-muted-foreground">+12% ↗</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">{completion}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold text-foreground">{stat.value}%</span>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend === 'up' ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">+{stat.change}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-red-500" />
                      <span className="text-red-500">-{stat.change}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 mx-3 bg-border rounded-full h-1.5 relative">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
