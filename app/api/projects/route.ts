import { auth } from '@/auth'
import { normalizeRole } from '@/lib/auth/roles'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = normalizeRole(session.user.role)

    if (role === Role.SENIOR_MANAGER || role === Role.ADMIN) {
      const projects = await prisma.project.findMany({
        include: { team: true, assignments: { include: { user: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(projects)
    }

    if (role === Role.TEAM_LEAD || role === Role.PROJECT_LEAD) {
      const projects = await prisma.project.findMany({
        where: {
          OR: [{ team: { leadId: session.user.id } }, { team: { members: { some: { id: session.user.id } } } }],
        },
        include: { team: true, assignments: { include: { user: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(projects)
    }

    const projects = await prisma.project.findMany({
      where: { assignments: { some: { userId: session.user.id } } },
      include: { team: true, assignments: { where: { userId: session.user.id } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = normalizeRole(session.user.role)
    if (role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Only admins can create projects' }, { status: 403 })
    }

    const body = await request.json()

    if (!body.name || !body.teamId) {
      return NextResponse.json({ error: 'Project name and team are required' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        color: body.color || '#3b82f6',
        status: body.status || 'planning',
        teamId: body.teamId,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
