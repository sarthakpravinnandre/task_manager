export const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/meetings': 'Meetings',
  '/team': 'Team',
  '/timeline': 'Timeline',
  '/messages': 'Messages',
  '/voice': 'Voice',
  '/settings': 'Settings',
  '/support': 'Support',
}

export function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  const segment = pathname.split('/').filter(Boolean)[0]
  if (!segment) return 'Home'
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}
