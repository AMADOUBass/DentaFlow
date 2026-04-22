import { headers } from 'next/headers'
import { prisma } from './prisma'

/**
 * Gets the tenant slug from the request headers injected by middleware
 */
export async function getTenantSlug() {
  const headersList = await headers()
  return headersList.get('x-tenant-slug')
}

/**
 * Fetches tenant data from the database based on the slug in headers
 */
export async function getTenant() {
  const identifier = await getTenantSlug()
  if (!identifier) return null

  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { slug: identifier },
        { customDomain: identifier }
      ]
    },
    include: {
      services: {
        where: { active: true },
        orderBy: { order: 'asc' }
      },
      practitioners: {
        where: { active: true }
      },
      businessHours: {
        orderBy: { weekday: 'asc' }
      }
    }
  })

  return tenant
}
