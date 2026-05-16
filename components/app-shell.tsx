import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

interface AppShellProps {
  children: React.ReactNode
  pageTitle?: string
  title?: string
  subtitle?: string
}

export function AppShell({ children, pageTitle, title, subtitle }: AppShellProps) {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Sidebar />
      <Navbar pageTitle={pageTitle} />

      <main className="ml-20 pt-20 p-8">
        <div className="max-w-[1600px] mx-auto">
          {(title || subtitle) && (
            <header className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              )}
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
