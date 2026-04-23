import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get('tenantSlug')

    if (!tenantSlug) {
      return new Response('tenantSlug is required', { status: 400 })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { name: true, primaryColor: true, logoUrl: true }
    })

    if (!tenant) {
      return new Response('Tenant not found', { status: 404 })
    }

    const primaryColor = tenant.primaryColor || '#0F766E'
    const name = tenant.name

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a', // Slate 900
            backgroundImage: `radial-gradient(circle at top right, ${primaryColor}44, transparent), radial-gradient(circle at bottom left, #0f172a, transparent)`,
            padding: '80px',
            fontFamily: 'Inter',
          }}
        >
          {/* Logo Circle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '30px',
              backgroundColor: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              marginBottom: '40px',
            }}
          >
            {tenant.logoUrl ? (
              <img
                src={tenant.logoUrl}
                width="80"
                height="80"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: primaryColor }}>
                {name.charAt(0)}
              </div>
            )}
          </div>

          <h1
            style={{
              fontSize: '84px',
              fontWeight: 900,
              color: 'white',
              textAlign: 'center',
              letterSpacing: '-0.05em',
              margin: '0',
              lineHeight: 1.1,
            }}
          >
            {name}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '40px',
              gap: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: primaryColor,
                padding: '12px 24px',
                borderRadius: '100px',
                color: 'white',
                fontSize: '28px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Prendre Rendez-vous
            </div>
            <div
              style={{
                color: '#94a3b8', // Slate 400
                fontSize: '28px',
                fontWeight: 500,
              }}
            >
              Oros — Oros
            </div>
          </div>

          {/* Accent bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '12px',
              backgroundColor: primaryColor,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error(e.message)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
