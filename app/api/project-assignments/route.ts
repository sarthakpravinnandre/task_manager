import { auth } from '@/auth'
import { normalizeRole } from '@/lib/auth/roles'
import prisma from '@/lib/prisma'
import { ProjectAssignmentStatus, Role } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = normalizeRole(session.user.role)
    const body = await request.json()

    if (body.action === 'assign') {
      if (role !== Role.ADMIN && role !== Role.TEAM_LEAD && role !== Role.PROJECT_LEAD) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      if (!body.projectId || !body.developerId) {
        return NextResponse.json({ error: 'projectId and developerId are required' }, { status: 400 })
      }

      const [project, developer] = await Promise.all([
        prisma.project.findUnique({
          where: { id: body.projectId },
          include: { team: true },
        }),
        prisma.user.findUnique({
          where: { id: body.developerId },
          select: { id: true, role: true, teamId: true },
        }),
      ])

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      if (!developer || developer.role !== Role.DEVELOPER) {
        return NextResponse.json({ error: 'Only developer accounts can be assigned' }, { status: 400 })
      }

      if (role === Role.TEAM_LEAD || role === Role.PROJECT_LEAD) {
        if (!project.teamId || project.team?.leadId !== session.user.id) {
          return NextResponse.json({ error: 'You can assign only within your managed teams' }, { status: 403 })
        }
      }

      if (project.teamId && developer.teamId && project.teamId !== developer.teamId) {
        return NextResponse.json({ error: 'Developer must belong to the same team as project' }, { status: 400 })
      }

      const assignment = await prisma.projectAssignment.upsert({
        where: {
          projectId_userId: {
            projectId: body.projectId,
            userId: body.developerId,
          },
        },
        update: { status: ProjectAssignmentStatus.PENDING },
        create: {
          projectId: body.projectId,
          userId: body.developerId,
          status: ProjectAssignmentStatus.PENDING,
        },
      })

      return NextResponse.json(assignment)
    }

    if (role !== Role.DEVELOPER) {
      return NextResponse.json({ error: 'Only developers can update acceptance status' }, { status: 403 })
    }

    if (!body.projectId || !body.action) {
      return NextResponse.json({ error: 'projectId and action are required' }, { status: 400 })
    }

    if (!['accept', 'start', 'complete'].includes(body.action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const existing = await prisma.projectAssignment.findUnique({
      where: {
        projectId_userId: {
          projectId: body.projectId,
          userId: session.user.id,
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'No assignment found for this project' }, { status: 404 })
    }

    let status = existing.status
    const now = new Date()
    const data: {
      status: ProjectAssignmentStatus
      acceptedAt?: Date
      startedAt?: Date
      completedAt?: Date
    } = { status }

    if (body.action === 'accept') {
      status = ProjectAssignmentStatus.ACCEPTED
      data.status = status
      data.acceptedAt = now
    }

    if (body.action === 'start') {
      status = ProjectAssignmentStatus.IN_PROGRESS
      data.status = status
      data.startedAt = now
    }

    if (body.action === 'complete') {
      status = ProjectAssignmentStatus.COMPLETED
      data.status = status
      data.completedAt = now
    }

    const updated = await prisma.projectAssignment.update({
      where: {
        projectId_userId: {
          projectId: body.projectId,
          userId: session.user.id,
        },
      },
      data,
      include: { project: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
