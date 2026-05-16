import { isScopedResponse, requireApiSession } from '@/lib/api/session'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const channels = await prisma.voiceChannel.findMany({
      where: session.teamId
        ? {
            OR: [{ teamId: session.teamId }, { teamId: null }],
          }
        : undefined,
      include: {
        team: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(channels)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
