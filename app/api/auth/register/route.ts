import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = String(body?.email ?? '').trim().toLowerCase()
    const password = String(body?.password ?? '')
    const fullName = String(body?.fullName ?? '').trim()
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Public registration is developer-only; elevated roles are assigned by admins.
    const requestedRole = String(body?.role ?? '').toUpperCase().replace(/-/g, '_')
    if (requestedRole && requestedRole !== 'DEVELOPER') {
      return NextResponse.json(
        { message: 'Only developer accounts can be created via sign-up' },
        { status: 403 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        password: hashedPassword,
        role: Role.DEVELOPER,
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
