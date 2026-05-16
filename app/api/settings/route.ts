import { isScopedResponse, requireApiSession } from '@/lib/api/session'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const settings = await prisma.userSetting.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId },
      update: {},
    })

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, bio: true, role: true, image: true },
    })

    return NextResponse.json({ ...settings, user })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireApiSession()
    if (isScopedResponse(session)) return session

    const body = await request.json()
    const { theme, notificationsEnabled, name, bio } = body

    const [settings] = await Promise.all([
      prisma.userSetting.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          ...(theme !== undefined && { theme }),
          ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        },
        update: {
          ...(theme !== undefined && { theme }),
          ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        },
      }),
      ...(name !== undefined || bio !== undefined
        ? [
            prisma.user.update({
              where: { id: session.userId },
              data: {
                ...(name !== undefined && { name }),
                ...(bio !== undefined && { bio }),
              },
            }),
          ]
        : []),
    ])

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, bio: true, role: true, image: true },
    })

    return NextResponse.json({ ...settings, user })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
