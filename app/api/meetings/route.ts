import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const meetings = await prisma.meeting.findMany({
      where: { userId: session.user.id },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json(meetings)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const meeting = await prisma.meeting.create({
      data: {
        title: body.title,
        description: body.description,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        attendees: body.attendees ?? 1,
        status: body.status ?? 'scheduled',
        userId: session.user.id,
      },
    })

    return NextResponse.json(meeting)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
