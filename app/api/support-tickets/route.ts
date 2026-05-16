import { isScopedResponse, requireApiSession } from '@/lib/api/session'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const isStaff = session.role === Role.ADMIN || session.role === Role.SENIOR_MANAGER

    const tickets = await prisma.supportTicket.findMany({
      where: isStaff ? undefined : { userId: session.userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const body = await request.json()
    if (!body.subject?.trim() || !body.description?.trim()) {
      return NextResponse.json(
        { error: 'subject and description are required' },
        { status: 400 }
      )
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        subject: body.subject.trim(),
        description: body.description.trim(),
        status: 'open',
        userId: session.userId,
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
