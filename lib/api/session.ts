import { auth } from '@/auth'
import { getScopedUserIds, resolveSessionTeamId } from '@/lib/api/scope'
import { normalizeRole } from '@/lib/auth/roles'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

export type ApiSession = {
  userId: string
  role: Role
  teamId: string | undefined
  scopedUserIds: string[]
}

export async function requireApiSession(): Promise<ApiSession | NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const teamId = await resolveSessionTeamId(
    session.user.id,
    (session.user as { teamId?: string }).teamId
  )
  const role = normalizeRole(session.user.role)
  const scopedUserIds = await getScopedUserIds(
    session.user.id,
    session.user.role,
    teamId
  )

  return { userId: session.user.id, role, teamId, scopedUserIds }
}

export function isScopedResponse(
  result: ApiSession | NextResponse
): result is NextResponse {
  return result instanceof NextResponse
}
