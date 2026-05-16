'use client'

import { useSession } from 'next-auth/react'
import useSWR, { mutate } from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RoleWorkspace() {
  const { data: session } = useSession()
  const role = (session?.user?.role || 'DEVELOPER').toUpperCase()
  const { data: teams = [] } = useSWR<any[]>('/api/teams', fetcher)
  const { data: projects = [] } = useSWR<any[]>('/api/projects', fetcher)

  const [projectName, setProjectName] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [developerId, setDeveloperId] = useState('')
  const [message, setMessage] = useState('')

  const createProject = async () => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projectName, teamId: selectedTeamId }),
    })
    const data = await res.json()
    setMessage(res.ok ? 'Project created successfully.' : data.error || 'Failed to create project')
    if (res.ok) {
      setProjectName('')
      mutate('/api/projects')
      mutate('/api/dashboard')
    }
  }

  const assignDeveloper = async (projectId: string) => {
    const res = await fetch('/api/project-assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'assign', projectId, developerId }),
    })
    const data = await res.json()
    setMessage(res.ok ? 'Developer assigned.' : data.error || 'Failed to assign developer')
    if (res.ok) {
      mutate('/api/projects')
    }
  }

  const updateDeveloperStatus = async (projectId: string, action: 'accept' | 'start' | 'complete') => {
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
            <Button onClick={createProject}>Create Project</Button>
          </div>
        )}

        {(role === 'TEAM_LEAD' || role === 'PROJECT_LEAD') && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">Team lead can manage multiple teams and assign developers to projects.</p>
            <Input
              value={developerId}
              onChange={(e) => setDeveloperId(e.target.value)}
              placeholder="Developer user ID"
              className="bg-zinc-900 border-zinc-700"
            />
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between border border-white/10 rounded-md p-3">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-zinc-500">Team: {project.team?.name || 'Unassigned'}</p>
                </div>
                <Button size="sm" onClick={() => assignDeveloper(project.id)}>Assign</Button>
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
              const assignment = project.assignments?.[0]
              const status = assignment?.status || 'PENDING'

              return (
                <div key={project.id} className="border border-white/10 rounded-md p-3 space-y-2">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-zinc-500">Current status: {status}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => updateDeveloperStatus(project.id, 'accept')}>Accept</Button>
                    <Button size="sm" variant="secondary" onClick={() => updateDeveloperStatus(project.id, 'start')}>Start</Button>
                    <Button size="sm" variant="secondary" onClick={() => updateDeveloperStatus(project.id, 'complete')}>Complete</Button>
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
