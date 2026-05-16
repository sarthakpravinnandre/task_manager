import { isScopedResponse, requireApiSession } from '@/lib/api/session'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const tasks = await prisma.task.findMany({
      where: { userId: { in: session.scopedUserIds } },
      include: { project: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const body = await request.json()

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || 'todo',
        priority: body.priority || 'medium',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        projectId: body.projectId ?? null,
        userId: body.userId && session.scopedUserIds.includes(body.userId)
          ? body.userId
          : session.userId,
      },
      include: { project: true },
    })

    return NextResponse.json(task)
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

    const existing = await prisma.task.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    if (!session.scopedUserIds.includes(existing.userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.priority !== undefined && { priority: updates.priority }),
        ...(updates.dueDate !== undefined && {
          dueDate: updates.dueDate ? new Date(updates.dueDate) : null,
        }),
        ...(updates.projectId !== undefined && { projectId: updates.projectId }),
      },
      include: { project: true },
    })

    return NextResponse.json(task)
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

    const existing = await prisma.task.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    if (!session.scopedUserIds.includes(existing.userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
