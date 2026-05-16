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

    if (role === Role.ADMIN || role === Role.SENIOR_MANAGER) {
      const teams = await prisma.team.findMany({
        include: {
          lead: { select: { id: true, name: true, email: true } },
          members: { select: { id: true, name: true, email: true, role: true } },
          projects: true,
        },
      })
      return NextResponse.json(teams)
    }

    if (role === Role.TEAM_LEAD) {
      const teams = await prisma.team.findMany({
        where: { leadId: session.user.id },
        include: {
          lead: { select: { id: true, name: true, email: true } },
          members: { select: { id: true, name: true, email: true, role: true } },
          projects: true,
        },
      })
      return NextResponse.json(teams)
    }

    const teams = await prisma.team.findMany({
      where: { members: { some: { id: session.user.id } } },
      include: {
        lead: { select: { id: true, name: true, email: true } },
        members: { select: { id: true, name: true, email: true, role: true } },
        projects: true,
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = normalizeRole(session.user.role)
    if (role !== Role.TEAM_LEAD && role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Only team leads/admin can manage teams' }, { status: 403 })
    }

    const body = await request.json()
    const { teamId, name, developerId } = body

    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } })
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    if (role === Role.TEAM_LEAD && team.leadId !== session.user.id) {
      return NextResponse.json({ error: 'You can only manage your teams' }, { status: 403 })
    }

    if (name) {
      await prisma.team.update({ where: { id: teamId }, data: { name } })
    }

    if (developerId) {
      await prisma.user.update({ where: { id: developerId }, data: { teamId } })
    }

    const updated = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        lead: { select: { id: true, name: true, email: true } },
        members: { select: { id: true, name: true, email: true, role: true } },
        projects: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
