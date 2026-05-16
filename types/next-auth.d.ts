import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  role: string
  teamId?: string | null
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }

  interface User {
    role?: string
    teamId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    teamId?: string | null
  }
}
