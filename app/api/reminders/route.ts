import { isScopedResponse, requireApiSession } from '@/lib/api/session'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const reminders = await prisma.reminder.findMany({
      where: { userId: { in: session.scopedUserIds } },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(reminders)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const body = await request.json()

    const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : new Date()

    const reminder = await prisma.reminder.create({
      data: {
        title: body.title,
        scheduledAt,
        priority: body.priority || 'low',
        userId: session.userId,
      },
    })

    return NextResponse.json(reminder)
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

    const existing = await prisma.reminder.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
    }
    if (existing.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const reminder = await prisma.reminder.update({
      where: { id },
      data: {
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.scheduledAt !== undefined && {
          scheduledAt: new Date(updates.scheduledAt),
        }),
        ...(updates.priority !== undefined && { priority: updates.priority }),
      },
    })

    return NextResponse.json(reminder)
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

    const existing = await prisma.reminder.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
    }
    if (existing.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.reminder.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
