import { auth } from '@/auth'
import { getDashboardData } from '@/lib/dashboard/get-dashboard-data'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let teamId = (session.user as { teamId?: string }).teamId
    if (!teamId) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { teamId: true },
      })
      teamId = user?.teamId ?? undefined
    }

    const data = await getDashboardData(
      session.user.id,
      session.user.role,
      teamId
    )

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
