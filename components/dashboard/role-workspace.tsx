'use client'

import { useSession } from 'next-auth/react'
import useSWR, { mutate } from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMemo, useState } from 'react'

type TeamMember = {
  id: string
  name: string | null
  email: string | null
  role: string
}

type TeamData = {
  id: string
  name: string
  members: TeamMember[]
}

type ProjectAssignment = {
  userId: string
  status: string
}

type ProjectData = {
  id: string
  name: string
  teamId: string | null
  team?: { id: string; name: string } | null
  assignments?: ProjectAssignment[]
}

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || `Failed to fetch ${url}`)
  }
  return data
}

export function RoleWorkspace() {
  const { data: session } = useSession()
  const role = (session?.user?.role || 'DEVELOPER').toUpperCase()
  const userId = session?.user?.id ?? ''

  const { data: teams = [] } = useSWR<TeamData[]>('/api/teams', fetcher)
  const { data: projects = [] } = useSWR<ProjectData[]>('/api/projects', fetcher)

  const [projectName, setProjectName] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const developerOptions = useMemo(() => {
    return teams
      .flatMap((team) => team.members.map((member) => ({ ...member, teamId: team.id, teamName: team.name })))
      .filter((member) => member.role === 'DEVELOPER')
  }, [teams])

  const [selectedDeveloperId, setSelectedDeveloperId] = useState('')

  const createProject = async () => {
    if (!projectName.trim() || !selectedTeamId) {
      setMessage('Please provide project name and team.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName.trim(), teamId: selectedTeamId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Failed to create project')
        return
      }

      setMessage('Project created successfully.')
      setProjectName('')
      mutate('/api/projects')
      mutate('/api/dashboard')
    } finally {
      setIsSubmitting(false)
    }
  }

  const assignDeveloper = async (projectId: string) => {
    if (!selectedDeveloperId) {
      setMessage('Please select a developer first.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/project-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign', projectId, developerId: selectedDeveloperId }),
      })
      const data = await res.json()
      setMessage(res.ok ? 'Developer assigned.' : data.error || 'Failed to assign developer')
      if (res.ok) {
        mutate('/api/projects')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateDeveloperStatus = async (projectId: string, action: 'accept' | 'start' | 'complete') => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/project-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, projectId }),
      })
      const data = await res.json()
      setMessage(res.ok ? `Project ${action}ed.` : data.error || `Failed to ${action} project`)
      if (res.ok) {
        mutate('/api/projects')
        mutate('/api/dashboard')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-[#121212] border-white/10 text-white mb-6">
      <CardHeader>
        <CardTitle>Role Workspace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {role === 'ADMIN' && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">Admin can create projects and map them to teams.</p>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              className="bg-zinc-900 border-zinc-700"
            />
            <select
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2 text-sm"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <Button onClick={createProject} disabled={isSubmitting}>Create Project</Button>
          </div>
        )}

        {(role === 'TEAM_LEAD' || role === 'PROJECT_LEAD') && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">Manage multiple teams and assign developers to projects.</p>
            <select
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2 text-sm"
              value={selectedDeveloperId}
              onChange={(e) => setSelectedDeveloperId(e.target.value)}
            >
              <option value="">Select developer</option>
              {developerOptions.map((developer) => (
                <option key={developer.id} value={developer.id}>
                  {(developer.name || developer.email || developer.id) + ` (${developer.teamName})`}
                </option>
              ))}
            </select>
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between border border-white/10 rounded-md p-3 gap-2">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-zinc-500">Team: {project.team?.name || 'Unassigned'}</p>
                </div>
                <Button size="sm" onClick={() => assignDeveloper(project.id)} disabled={isSubmitting}>Assign</Button>
              </div>
            ))}
          </div>
        )}

        {role === 'SENIOR_MANAGER' && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Senior manager monitoring view.</p>
            <p className="text-sm">Total Teams: {teams.length}</p>
            <p className="text-sm">Total Projects: {projects.length}</p>
          </div>
        )}

        {role === 'DEVELOPER' && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">Accept assigned projects and update progress status.</p>
            {projects.map((project) => {
              const assignment = project.assignments?.find((item) => item.userId === userId) ?? project.assignments?.[0]
              const status = assignment?.status || 'PENDING'

              return (
                <div key={project.id} className="border border-white/10 rounded-md p-3 space-y-2">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-zinc-500">Current status: {status}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => updateDeveloperStatus(project.id, 'accept')} disabled={isSubmitting}>Accept</Button>
                    <Button size="sm" variant="secondary" onClick={() => updateDeveloperStatus(project.id, 'start')} disabled={isSubmitting}>Start</Button>
                    <Button size="sm" variant="secondary" onClick={() => updateDeveloperStatus(project.id, 'complete')} disabled={isSubmitting}>Complete</Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {message && <p className="text-sm text-blue-300">{message}</p>}
      </CardContent>
    </Card>
  )
}
