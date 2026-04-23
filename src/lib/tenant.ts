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

/**
 * Generates a tenant-aware link path.
 * On subdomains/custom domains, it returns the relative path.
 * On the root domain, it prepends the tenant slug.
 */
export async function getTenantPath(path: string) {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
  const slug = headersList.get('x-tenant-slug')

  // If we are on root domain, we need the slug in the path
  if (host === rootDomain || host === `www.${rootDomain}`) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `/${slug}${cleanPath}`
  }

  // If we are on a subdomain or custom domain, the path is already relative to the tenant
  return path.startsWith('/') ? path : `/${path}`
}
