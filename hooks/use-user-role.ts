'use client'

import { useSession } from 'next-auth/react'

export type UserRole = 'admin' | 'developer' | 'team_lead' | 'senior_manager' | 'project_lead'

interface User {
  id: string
  role: UserRole
  name: string
  email: string
}

export function useUserRole() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const user: User | null = session?.user
    ? {
        id: session.user.id || '',
        role: (session.user.role?.toLowerCase() as UserRole) || 'developer',
        name: session.user.name || '',
        email: session.user.email || '',
      }
    : null

  return { user, loading }
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    'admin': 4,
    'senior_manager': 3,
    'project_lead': 2,
    'team_lead': 2,
    'developer': 0,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
