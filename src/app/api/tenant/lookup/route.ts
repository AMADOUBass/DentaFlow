import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Internal API to lookup a tenant slug by custom domain.
 * This runs in a standard Node.js runtime, which allows Prisma access.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { customDomain: domain },
      select: { slug: true }
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    return NextResponse.json({ slug: tenant.slug })
  } catch (error) {
    console.error('[DOMAIN_LOOKUP_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
