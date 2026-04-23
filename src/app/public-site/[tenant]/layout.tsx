import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant()
  if (!tenant) return { title: 'Oros' }
  
  const ogUrl = new URL('/api/og', process.env.NEXT_PUBLIC_APP_URL || 'https://oros.ca')
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
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function RootTenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenant()
  if (!tenant) notFound()

  return (
    <>
      {children}
    </>
  )
}
