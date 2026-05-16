'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  Users, 
  Clock, 
  MessageSquare, 
  Mic2, 
  Settings, 
  Headphones, 
  LogOut 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navigationItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: ListTodo, label: 'Tasks' },
  { href: '/meetings', icon: Calendar, label: 'Meetings' },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/timeline', icon: Clock, label: 'Timeline' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
]

type NavigationItem = {
  href: string
  icon: typeof LayoutDashboard
  label: string
  badge?: string | number
}

const bottomItems = [
  { href: '/voice', icon: Mic2, label: 'Voice' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/support', icon: Headphones, label: 'Support' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-sidebar border-r border-sidebar-border pt-6 flex flex-col items-center">
      {/* Logo */}
      <div className="mb-10">
        <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 flex flex-col gap-4">
          {(navigationItems as NavigationItem[]).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-blue-600/10 text-blue-500 shadow-inner shadow-blue-500/10'
                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </Button>
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-sidebar">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* Bottom Items */}
        <div className="pb-8 flex flex-col gap-4">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-red-500/10 text-red-500'
                          : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                      } ${item.label === 'Voice' ? 'bg-red-500/20 text-red-500' : ''}`}
                    >
                      <Icon className="w-6 h-6" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                aria-label="Log out"
                className="w-12 h-12 rounded-xl text-muted-foreground hover:text-orange-500 hover:bg-orange-500/5 transition-all duration-300"
              >
                <LogOut className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  )
}
