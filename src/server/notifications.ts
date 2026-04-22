'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

/**
 * Fetch notifications for the current tenant
 */
export async function getNotificationsAction() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  return prisma.notification.findMany({
    where: { 
      tenantId,
      OR: [
        { userId: null },
        { userId: user.id }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
}

/**
 * Mark a notification as read
 */
export async function markAsReadAction(id: string) {
  await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  })
  revalidatePath('/', 'layout')
}

/**
 * Create a new notification (Internal utility)
 */
export async function createNotification(data: {
  tenantId: string
  title: string
  message: string
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  link?: string
  userId?: string
}) {
  return prisma.notification.create({
    data: {
      ...data,
      type: data.type || 'INFO'
    }
  })
}
