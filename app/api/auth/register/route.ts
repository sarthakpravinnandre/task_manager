import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, fullName, role } = body
    const normalizedEmail = String(email).trim().toLowerCase()

    if (!normalizedEmail || !password || !fullName || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const key = String(role).toUpperCase()
    const roleMap: Record<string, Role> = {
      ADMIN: Role.ADMIN,
      DEVELOPER: Role.DEVELOPER,
      TEAM_LEAD: Role.TEAM_LEAD,
      SENIOR_MANAGER: Role.SENIOR_MANAGER,
      PROJECT_LEAD: Role.PROJECT_LEAD,
    }
    const mappedRole = roleMap[key]
    if (!mappedRole) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: fullName,
        password: hashedPassword,
        role: mappedRole,
      },
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
