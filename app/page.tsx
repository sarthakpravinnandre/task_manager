'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle, Users, Zap, Shield, BarChart3, Clock } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (session?.user) {
      router.push('/dashboard')
    } else {
      setIsLoading(false)
    }
  }, [session, status, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Shield className="h-8 w-8" />
            TeamHub
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-balance text-4xl font-bold md:text-6xl">
            Team Management Simplified
          </h1>
          <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl">
            Manage projects, tasks, and team collaboration with role-based access control. 
            Perfect for developers, team leads, managers, and project leads.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Today
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card/50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-3xl font-bold">Powerful Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-6">
              <Users className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Role-Based Access</h3>
              <p className="text-muted-foreground">
                4-tier permission system for Developers, Team Leads, Senior Managers, and Project Leads.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <BarChart3 className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Track project progress, team activity, and performance metrics in real-time.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <Clock className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Task Management</h3>
              <p className="text-muted-foreground">
                Create, assign, and track tasks with priority levels and due dates.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <Zap className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Meeting Scheduler</h3>
              <p className="text-muted-foreground">
                Schedule meetings, invite attendees, and manage your calendar seamlessly.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <Shield className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with row-level security and encrypted data.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <CheckCircle className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Smart Reminders</h3>
              <p className="text-muted-foreground">
                Never miss important tasks or meetings with intelligent reminder system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to transform your team?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of teams using TeamHub to streamline their workflow.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>&copy; 2026 TeamHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
