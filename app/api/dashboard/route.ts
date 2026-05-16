import { auth } from '@/auth'
import { resolveSessionTeamId } from '@/lib/api/scope'
import { getDashboardData } from '@/lib/dashboard/get-dashboard-data'
import type { TimelinePeriod } from '@/lib/dashboard/types'
import { NextResponse } from 'next/server'

const VALID_PERIODS: TimelinePeriod[] = ['today', 'week', 'month', 'year']

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const periodParam = searchParams.get('period')?.toLowerCase()
    const timelinePeriod = VALID_PERIODS.includes(periodParam as TimelinePeriod)
      ? (periodParam as TimelinePeriod)
      : 'week'

    const teamId = await resolveSessionTeamId(
      session.user.id,
      (session.user as { teamId?: string }).teamId
    )

    const data = await getDashboardData(
      session.user.id,
      session.user.role,
      teamId,
      timelinePeriod
    )

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
