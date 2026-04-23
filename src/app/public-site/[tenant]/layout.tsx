import { getTenantSlug } from '@/lib/tenant'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

async function fetchTenantBasic() {
  try {
    const identifier = await getTenantSlug()
    if (!identifier) return null
    return await prisma.tenant.findFirst({
      where: { OR: [{ slug: identifier }, { customDomain: identifier }] },
      select: { id: true, name: true, slug: true },
    })
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await fetchTenantBasic()
  if (!tenant) return { title: 'Oros' }

  const ogUrl = new URL('/api/og', process.env.NEXT_PUBLIC_APP_URL || 'https://oros.homes')
  ogUrl.searchParams.set('tenantSlug', tenant.slug)

  return {
    title: {
      default: tenant.name,
      template: `%s | ${tenant.name}`
    },
    description: `Portail patient de ${tenant.name}.`,
    openGraph: {
      title: tenant.name,
      description: `Prenez rendez-vous en ligne chez ${tenant.name}.`,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    },
  }
}

export default async function RootTenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await fetchTenantBasic()
  if (!tenant) notFound()

  return <>{children}</>
}
