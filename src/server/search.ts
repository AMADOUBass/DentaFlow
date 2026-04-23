'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'

export async function globalSearchAction(query: string) {
  if (!query || query.length < 2) return { patients: [], services: [] }

  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const [patients, services] = await Promise.all([
    prisma.patient.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),
    prisma.service.findMany({
      where: {
        tenantId,
        name: { contains: query, mode: 'insensitive' },
        active: true,
      },
      take: 5,
    }),
  ])

  return { patients, services }
}
