import { isScopedResponse, requireApiSession } from '@/lib/api/session'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId },
          { receiverId: session.userId },
          ...(session.teamId ? [{ teamId: session.teamId }] : []),
        ],
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const body = await request.json()
    if (!body.content?.trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        content: body.content.trim(),
        senderId: session.userId,
        receiverId: body.receiverId ?? null,
        teamId: body.teamId ?? null,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
