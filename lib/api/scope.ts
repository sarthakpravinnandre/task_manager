import { normalizeRole } from '@/lib/auth/roles'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function getScopedUserIds(
  userId: string,
  roleInput: string | null | undefined,
  teamId: string | null | undefined
): Promise<string[]> {
  const role = normalizeRole(roleInput)

  switch (role) {
    case Role.TEAM_LEAD:
    case Role.PROJECT_LEAD:
      if (!teamId) return [userId]
      {
        const members = await prisma.user.findMany({
          where: { teamId },
          select: { id: true },
        })
        return members.length > 0 ? members.map((m) => m.id) : [userId]
      }
    case Role.SENIOR_MANAGER:
    case Role.ADMIN: {
      const all = await prisma.user.findMany({ select: { id: true } })
      return all.map((u) => u.id)
    }
    default:
      return [userId]
  }
}

export async function resolveSessionTeamId(
  userId: string,
  sessionTeamId?: string | null
): Promise<string | undefined> {
  if (sessionTeamId) return sessionTeamId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { teamId: true },
  })
  return user?.teamId ?? undefined
}
