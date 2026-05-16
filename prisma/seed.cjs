require('dotenv/config')
const { PrismaClient, Role } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const { addDays, setHours, setMinutes, startOfWeek } = require('date-fns')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('password123', 10)

  await prisma.userSetting.deleteMany()
  await prisma.supportTicket.deleteMany()
  await prisma.message.deleteMany()
  await prisma.voiceChannel.deleteMany()
  await prisma.reminder.deleteMany()
  await prisma.meeting.deleteMany()
  await prisma.task.deleteMany()
  await prisma.projectAssignment.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
  await prisma.team.deleteMany()

  const admin = await prisma.user.create({
    data: {
      name: 'Ava Admin',
      email: 'admin@example.com',
      password,
      role: Role.ADMIN,
    },
  })
  const teamLead = await prisma.user.create({
    data: {
      name: 'Maria Team Lead',
      email: 'lead@example.com',
      password,
      role: Role.TEAM_LEAD,
    },
  })

  // Create multiple teams managed by the team lead
  const backendTeam = await prisma.team.create({
    data: { name: 'Backend Team', leadId: teamLead.id },
  })

  const frontendTeam = await prisma.team.create({
    data: { name: 'Frontend Team', leadId: teamLead.id },
  })

  const databaseTeam = await prisma.team.create({
    data: { name: 'Database Team', leadId: teamLead.id },
  })

  const projects = await Promise.all([
    prisma.project.create({ data: { name: 'Core API Revamp', color: '#f97316', teamId: backendTeam.id } }),
    prisma.project.create({ data: { name: 'Landing Page Redesign', color: '#22c55e', teamId: frontendTeam.id } }),
    prisma.project.create({ data: { name: 'Data Migration V2', color: '#ef4444', teamId: databaseTeam.id } }),
    prisma.project.create({ data: { name: 'Admin Dashboard', color: '#3b82f6', teamId: frontendTeam.id } }),
  ])

  const developer = await prisma.user.create({
    data: {
      name: 'Alex Developer',
      email: 'dev@example.com',
      password,
      role: Role.DEVELOPER,
      teamId: backendTeam.id,
    },
  })

  const manager = await prisma.user.create({
    data: {
      name: 'Sam Manager',
      email: 'manager@example.com',
      password,
      role: Role.SENIOR_MANAGER,
    },
  })

  const projectLead = await prisma.user.create({
    data: {
      name: 'Jordan Project Lead',
      email: 'project@example.com',
      password,
      role: Role.PROJECT_LEAD,
      teamId: frontendTeam.id,
    },
  })

  // Create Project Assignments for the developer
  await prisma.projectAssignment.create({
    data: {
      projectId: projects[0].id, // Core API Revamp
      userId: developer.id,
      status: 'ACCEPTED',
      acceptedAt: new Date(),
      startedAt: new Date(),
    }
  })

  await prisma.projectAssignment.create({
    data: {
      projectId: projects[2].id, // Data Migration V2
      userId: developer.id,
      status: 'PENDING',
    }
  })

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const users = [developer, teamLead, manager, projectLead, admin]

  for (const [index, user] of users.entries()) {
    const project = projects[index % projects.length]
    const dayOffset = index

    await prisma.task.createMany({
      data: [
        {
          title: 'Color Palette Selection',
          description: 'Create a harmonious color scheme',
          status: 'in_progress',
          priority: 'high',
          projectId: project.id,
          userId: user.id,
          dueDate: addDays(weekStart, dayOffset + 2),
        },
        {
          title: 'Landing page wireframes',
          description: 'Define layout and components',
          status: 'todo',
          priority: 'medium',
          projectId: projects[(index + 1) % projects.length].id,
          userId: user.id,
          dueDate: addDays(weekStart, dayOffset + 3),
        },
        {
          title: 'Sprint retrospective notes',
          status: 'completed',
          priority: 'low',
          projectId: projects[(index + 2) % projects.length].id,
          userId: user.id,
          dueDate: addDays(weekStart, dayOffset),
        },
      ],
    })

    const meetingStart = setMinutes(setHours(new Date(), 10 + index), 0)
    const end = new Date(meetingStart)
    end.setHours(end.getHours() + 1)

    await prisma.meeting.create({
      data: {
        title: index === 0 ? 'Present the project and gather feedback' : 'Team sync',
        startTime: meetingStart,
        endTime: end,
        attendees: 3 + index,
        userId: user.id,
      },
    })

    await prisma.reminder.createMany({
      data: [
        { title: 'Check test results', time: '09:30 AM', priority: 'low', userId: user.id },
        { title: 'Client Presentation', time: '10:00 AM', priority: 'high', userId: user.id },
      ],
    })

    // Create User Settings
    await prisma.userSetting.create({
      data: {
        userId: user.id,
        theme: index % 2 === 0 ? 'dark' : 'light',
        notificationsEnabled: true,
      }
    })
  }

  // Create Voice Channels
  const voiceChannels = await Promise.all([
    prisma.voiceChannel.create({ data: { name: 'General Voice', teamId: backendTeam.id } }),
    prisma.voiceChannel.create({ data: { name: 'Design Sync', teamId: frontendTeam.id } }),
    prisma.voiceChannel.create({ data: { name: 'Data Ops', teamId: databaseTeam.id } })
  ])

  // Create Support Tickets
  await prisma.supportTicket.create({
    data: {
      subject: 'Cannot access production DB',
      description: 'I am getting an access denied error when trying to connect to the new Neon database.',
      status: 'open',
      userId: developer.id,
    }
  })

  // Create Messages
  await prisma.message.create({
    data: {
      content: 'Hey Maria, can we sync on the Core API Revamp?',
      senderId: developer.id,
      receiverId: teamLead.id,
    }
  })

  await prisma.message.create({
    data: {
      content: 'Sure thing, Alex. Join the General Voice channel.',
      senderId: teamLead.id,
      receiverId: developer.id,
    }
  })

  console.log('Seed complete.')
  console.log('Admin: admin@example.com / password123')
  console.log('Team Lead: lead@example.com / password123')
  console.log('Developer: dev@example.com / password123')
  console.log('Manager: manager@example.com / password123')
  console.log('Project Lead: project@example.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
