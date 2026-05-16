'use client'

import { Bell, Moon, Sun, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDashboard } from '@/hooks/use-dashboard'

export function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const { data: dashboard } = useDashboard()
  const user = session?.user

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

  return (
    <nav className="fixed top-0 right-0 left-20 h-20 flex items-center justify-between px-8 z-40 bg-[#0a0a0a]/50 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center bg-white/5 rounded-full px-3 py-1 gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/10">
            <Moon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/10">
            <Sun className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5">
            <Bell className="w-5 h-5" />
          </Button>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer group">
              <Avatar className="w-10 h-10 border-2 border-white/5 ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#121212] border-white/10 text-white">
            {user && (
              <>
                <DropdownMenuItem disabled className="text-sm opacity-50">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
