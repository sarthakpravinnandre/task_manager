import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedRoutes = [
        '/dashboard',
        '/tasks',
        '/meetings',
        '/team',
        '/settings',
        '/timeline',
        '/messages',
        '/voice',
        '/support',
      ]
      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      )

      if (isProtectedRoute) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (nextUrl.pathname.startsWith('/auth/login') || nextUrl.pathname.startsWith('/auth/sign-up')) {
           return Response.redirect(new URL('/dashboard', nextUrl))
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      if (token.teamId && session.user) {
        session.user.teamId = token.teamId as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.teamId = user.teamId;
      }
      return token;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
