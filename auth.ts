import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials)

          if (!parsedCredentials.success) {
            console.warn('[auth] Credentials parse failed')
            return null
          }

          const { email, password } = parsedCredentials.data
          const normalizedEmail = email.trim().toLowerCase()
          const normalizedPassword = password.trim()

          const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
          if (!user || !user.password) {
            console.warn(`[auth] User not found or no password: ${normalizedEmail}`)
            return null
          }

          const passwordsMatch = await bcrypt.compare(normalizedPassword, user.password)
          if (!passwordsMatch) {
            console.warn(`[auth] Password mismatch: ${normalizedEmail}`)
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            teamId: user.teamId,
          }
        } catch (error) {
          console.error('[auth] Authorize error:', error)
          return null
        }
      },
    }),
  ],
})
