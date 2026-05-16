'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Meeting {
  id: string
  title: string
  time: string
  duration: string
  attendees: number
  status: 'scheduled' | 'in_progress' | 'completed'
}

interface MeetingsListProps {
  meetings: Meeting[]
  count: number
}

export function MeetingsList({ meetings, count }: MeetingsListProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Today&apos;s meetings</CardTitle>
          <CardDescription className="text-muted-foreground">{count}</CardDescription>
        </div>
        <a href="#" className="text-primary text-sm hover:underline">
          View all →
        </a>
      </CardHeader>
      <CardContent className="space-y-3">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
            <div className="bg-primary/20 p-2 rounded">
              <Video className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-sm">{meeting.title}</div>
              <div className="text-xs text-muted-foreground">{meeting.time}</div>
            </div>
            <Badge variant="outline" className="text-xs">
              {meeting.duration}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
