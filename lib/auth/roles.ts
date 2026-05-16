import { Role } from '@prisma/client'

export function normalizeRole(role?: string | null): Role {
  const key = (role ?? 'DEVELOPER').toUpperCase().replace(/-/g, '_')
  const map: Record<string, Role> = {
    ADMIN: Role.ADMIN,
    DEVELOPER: Role.DEVELOPER,
    TEAM_LEAD: Role.TEAM_LEAD,
    SENIOR_MANAGER: Role.SENIOR_MANAGER,
    PROJECT_LEAD: Role.PROJECT_LEAD,
  }
  return map[key] ?? Role.DEVELOPER
}

export function hasAnyRole(role: Role, allowed: Role[]): boolean {
  return allowed.includes(role)
}
