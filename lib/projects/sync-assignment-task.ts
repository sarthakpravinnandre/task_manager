import prisma from '@/lib/prisma'
import { ProjectAssignmentStatus, TaskPriority, TaskStatus } from '@prisma/client'

function assignmentToTaskStatus(status: ProjectAssignmentStatus): TaskStatus {
  switch (status) {
    case ProjectAssignmentStatus.IN_PROGRESS:
      return TaskStatus.in_progress
    case ProjectAssignmentStatus.COMPLETED:
      return TaskStatus.completed
    default:
      return TaskStatus.todo
  }
}

/** Keep dashboard tasks in sync with project assignment workflow. */
export async function syncAssignmentTask(
  projectId: string,
  userId: string,
  assignmentStatus: ProjectAssignmentStatus,
  projectName: string
) {
  const taskStatus = assignmentToTaskStatus(assignmentStatus)

  const existing = await prisma.task.findFirst({
    where: { projectId, userId },
    orderBy: { updatedAt: 'desc' },
  })

  if (existing) {
    return prisma.task.update({
      where: { id: existing.id },
      data: { status: taskStatus, title: projectName },
    })
  }

  return prisma.task.create({
    data: {
      title: projectName,
      status: taskStatus,
      priority: TaskPriority.medium,
      projectId,
      userId,
    },
  })
}
