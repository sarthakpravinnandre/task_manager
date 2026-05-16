import { isScopedResponse, requireApiSession } from '@/lib/api/session'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const meetings = await prisma.meeting.findMany({
      where: { userId: { in: session.scopedUserIds } },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json(meetings)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const body = await request.json()

    const meeting = await prisma.meeting.create({
      data: {
        title: body.title,
        description: body.description,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        attendees: body.attendees ?? 1,
        status: body.status ?? 'scheduled',
        userId: body.userId && session.scopedUserIds.includes(body.userId)
          ? body.userId
          : session.userId,
      },
    })

    return NextResponse.json(meeting)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await prisma.meeting.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }
    if (!session.scopedUserIds.includes(existing.userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const meeting = await prisma.meeting.update({
      where: { id },
      data: {
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.startTime !== undefined && { startTime: new Date(updates.startTime) }),
        ...(updates.endTime !== undefined && { endTime: new Date(updates.endTime) }),
        ...(updates.attendees !== undefined && { attendees: updates.attendees }),
        ...(updates.status !== undefined && { status: updates.status }),
      },
    })

    return NextResponse.json(meeting)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await prisma.meeting.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }
    if (!session.scopedUserIds.includes(existing.userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.meeting.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
