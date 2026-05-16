require('dotenv/config')
const { PrismaClient, Role } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const {
  addDays,
  addHours,
  setHours,
  setMinutes,
  startOfWeek,
  subDays,
} = require('date-fns')

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
    data: { name: 'Ava Admin', email: 'admin@example.com', password, role: Role.ADMIN },
  })
  const manager = await prisma.user.create({
    data: { name: 'Sam Manager', email: 'manager@example.com', password, role: Role.SENIOR_MANAGER },
  })
  const teamLeadBackend = await prisma.user.create({
    data: { name: 'Maria Team Lead', email: 'lead@example.com', password, role: Role.TEAM_LEAD },
  })
  const projectLeadFrontend = await prisma.user.create({
    data: {
      name: 'Jordan Project Lead',
      email: 'project@example.com',
      password,
      role: Role.PROJECT_LEAD,
    },
  })

  const backendTeam = await prisma.team.create({
    data: { name: 'Backend Team', leadId: teamLeadBackend.id },
  })
  const frontendTeam = await prisma.team.create({
    data: { name: 'Frontend Team', leadId: projectLeadFrontend.id },
  })
  const dataTeam = await prisma.team.create({
    data: { name: 'Data Team', leadId: manager.id },
  })

  await prisma.user.update({ where: { id: teamLeadBackend.id }, data: { teamId: backendTeam.id } })
  await prisma.user.update({ where: { id: projectLeadFrontend.id }, data: { teamId: frontendTeam.id } })

  const developers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alex Developer',
        email: 'dev@example.com',
        password,
        role: Role.DEVELOPER,
        teamId: backendTeam.id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Priya Developer',
        email: 'dev2@example.com',
        password,
        role: Role.DEVELOPER,
        teamId: frontendTeam.id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Rahul Developer',
        email: 'dev3@example.com',
        password,
        role: Role.DEVELOPER,
        teamId: dataTeam.id,
      },
    }),
  ])

  const projects = await Promise.all([
    prisma.project.create({
      data: { name: 'Core API Revamp', color: '#f97316', status: 'active', teamId: backendTeam.id },
    }),
    prisma.project.create({
      data: { name: 'Landing Page Redesign', color: '#22c55e', status: 'active', teamId: frontendTeam.id },
    }),
    prisma.project.create({
      data: { name: 'Data Migration V2', color: '#ef4444', status: 'planning', teamId: dataTeam.id },
    }),
    prisma.project.create({
      data: { name: 'Admin Dashboard', color: '#3b82f6', status: 'active', teamId: frontendTeam.id },
    }),
    prisma.project.create({
      data: { name: 'Incident Response Hub', color: '#06b6d4', status: 'active', teamId: backendTeam.id },
    }),
  ])

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const allUsers = [admin, manager, teamLeadBackend, projectLeadFrontend, ...developers]

  // Seed assignment lifecycle so developer dashboards can accept/start/complete flows.
  await prisma.projectAssignment.createMany({
    data: [
      {
        projectId: projects[0].id,
        userId: developers[0].id,
        status: 'IN_PROGRESS',
        acceptedAt: subDays(now, 2),
        startedAt: subDays(now, 1),
      },
      {
        projectId: projects[4].id,
        userId: developers[0].id,
        status: 'PENDING',
      },
      {
        projectId: projects[1].id,
        userId: developers[1].id,
        status: 'ACCEPTED',
        acceptedAt: subDays(now, 1),
      },
      {
        projectId: projects[3].id,
        userId: developers[1].id,
        status: 'COMPLETED',
        acceptedAt: subDays(now, 6),
        startedAt: subDays(now, 5),
        completedAt: subDays(now, 1),
      },
      {
        projectId: projects[2].id,
        userId: developers[2].id,
        status: 'PENDING',
      },
    ],
  })

  for (const [index, user] of allUsers.entries()) {
    const currentProject = projects[index % projects.length]
    const nextProject = projects[(index + 1) % projects.length]
    const reviewProject = projects[(index + 2) % projects.length]

    await prisma.task.createMany({
      data: [
        {
          title: `${currentProject.name} - Daily Execution`,
          description: 'Active implementation task for current sprint goals.',
          status: 'in_progress',
          priority: 'high',
          projectId: currentProject.id,
          userId: user.id,
          dueDate: addDays(now, 1 + (index % 3)),
        },
        {
          title: `${nextProject.name} - Planning Checklist`,
          description: 'Prepare handoff notes, dependencies, and blockers.',
          status: 'todo',
          priority: 'medium',
          projectId: nextProject.id,
          userId: user.id,
          dueDate: addDays(weekStart, 3 + (index % 2)),
        },
        {
          title: `${reviewProject.name} - Retrospective`,
          description: 'Document delivery outcomes and QA follow-ups.',
          status: 'completed',
          priority: 'low',
          projectId: reviewProject.id,
          userId: user.id,
          dueDate: subDays(now, 1 + (index % 2)),
        },
      ],
    })

    const firstMeetingStart = setMinutes(setHours(addDays(now, index % 2), 10 + (index % 4)), 0)
    const secondMeetingStart = setMinutes(setHours(addDays(now, 1), 14 + (index % 3)), 30)
    await prisma.meeting.createMany({
      data: [
        {
          title: index % 2 === 0 ? 'Project Progress Sync' : 'Stakeholder Standup',
          description: `Weekly checkpoint for ${currentProject.name}`,
          startTime: firstMeetingStart,
          endTime: addHours(firstMeetingStart, 1),
          attendees: 3 + (index % 5),
          status: 'scheduled',
          userId: user.id,
        },
        {
          title: 'Execution Follow-up',
          description: `Action review for ${nextProject.name}`,
          startTime: secondMeetingStart,
          endTime: addHours(secondMeetingStart, 1),
          attendees: 2 + (index % 4),
          status: 'scheduled',
          userId: user.id,
        },
      ],
    })

    const reminderMorning = setMinutes(setHours(now, 9), 30)
    const reminderNoon = setMinutes(setHours(now, 12), 0)
    const reminderEvening = setMinutes(setHours(now, 17), 45)

    await prisma.reminder.createMany({
      data: [
        { title: 'Review open tasks', scheduledAt: reminderMorning, priority: 'medium', userId: user.id },
        { title: 'Client status update', scheduledAt: reminderNoon, priority: 'high', userId: user.id },
        { title: 'Wrap-up and tomorrow plan', scheduledAt: reminderEvening, priority: 'low', userId: user.id },
      ],
    })

    await prisma.userSetting.create({
      data: {
        userId: user.id,
        theme: index % 2 === 0 ? 'dark' : 'light',
        notificationsEnabled: true,
      },
    })
  }

  await prisma.voiceChannel.createMany({
    data: [
      { name: 'Backend General', teamId: backendTeam.id },
      { name: 'Frontend Design Sync', teamId: frontendTeam.id },
      { name: 'Data Ops Room', teamId: dataTeam.id },
      { name: 'Core API War Room', projectId: projects[0].id },
      { name: 'Migration Command Center', projectId: projects[2].id },
    ],
  })

  await prisma.supportTicket.createMany({
    data: [
      {
        subject: 'Cannot access production DB',
        description: 'Getting access denied on read-replica while running migration checks.',
        status: 'open',
        userId: developers[2].id,
      },
      {
        subject: 'Dashboard widget loading slowly',
        description: 'Project chart panel takes too long after role switch.',
        status: 'in_progress',
        userId: projectLeadFrontend.id,
      },
    ],
  })

  await prisma.message.createMany({
    data: [
      {
        content: 'Please accept your Core API assignment and start today.',
        senderId: teamLeadBackend.id,
        receiverId: developers[0].id,
      },
      {
        content: 'Accepted. I will update status after architecture pass.',
        senderId: developers[0].id,
        receiverId: teamLeadBackend.id,
      },
      {
        content: 'Frontend sprint review at 3 PM. Share blockers early.',
        senderId: projectLeadFrontend.id,
        teamId: frontendTeam.id,
      },
      {
        content: 'Migration dependency list is ready for manager review.',
        senderId: developers[2].id,
        receiverId: manager.id,
      },
      {
        content: 'Great work team, keep assignment status updated in dashboard.',
        senderId: admin.id,
        teamId: backendTeam.id,
      },
    ],
  })

  console.log('Seed complete.')
  console.log('Admin: admin@example.com / password123')
  console.log('Team Lead: lead@example.com / password123')
  console.log('Developer: dev@example.com / password123')
  console.log('Developer 2: dev2@example.com / password123')
  console.log('Developer 3: dev3@example.com / password123')
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
