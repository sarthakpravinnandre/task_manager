'use client'

import { Bell, LogOut, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDashboard } from '@/hooks/use-dashboard'
import { getPageTitle } from '@/lib/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface NavbarProps {
  pageTitle?: string
}

export function Navbar({ pageTitle }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  const { data: dashboard } = useDashboard()
  const user = session?.user

  useEffect(() => setMounted(true), [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  const notificationCount = dashboard?.notificationCount ?? 0
  const title = pageTitle ?? getPageTitle(pathname)
  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark')

  return (
    <nav className="fixed top-0 right-0 left-20 h-20 flex items-center justify-between px-8 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center bg-muted rounded-full px-3 py-1 gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Use dark theme"
            aria-pressed={isDark}
            onClick={() => setTheme('dark')}
            className={`w-8 h-8 rounded-full ${isDark ? 'text-foreground bg-background' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Moon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Use light theme"
            aria-pressed={mounted && !isDark}
            onClick={() => setTheme('light')}
            className={`w-8 h-8 rounded-full ${!isDark && mounted ? 'text-foreground bg-background' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Sun className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={notificationCount > 0 ? `${notificationCount} notifications` : 'Notifications'}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border"
          >
            <Bell className="w-5 h-5" />
          </Button>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-background">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open account menu"
              className="relative cursor-pointer group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="w-10 h-10 border-2 border-border ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border text-foreground">
            {user && (
              <>
                <DropdownMenuItem disabled className="text-sm opacity-50">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
