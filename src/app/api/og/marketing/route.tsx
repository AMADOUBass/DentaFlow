import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Oros'
  const subtitle = searchParams.get('subtitle') ?? 'Gestion dentaire nouvelle génération au Québec'
  const tag = searchParams.get('tag') ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f172a',
          padding: '60px 70px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(15,118,110,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15,118,110,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'auto' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#0f766e',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 900,
              color: 'white',
            }}
          >
            O
          </div>
          <span style={{ color: 'white', fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px' }}>
            Oros
          </span>
          {tag && (
            <span
              style={{
                background: 'rgba(15,118,110,0.2)',
                border: '1px solid rgba(15,118,110,0.4)',
                color: '#2dd4bf',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginLeft: '8px',
              }}
            >
              {tag}
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: title.length > 45 ? '42px' : '56px',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              maxWidth: '820px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              fontWeight: 500,
              lineHeight: 1.4,
              maxWidth: '700px',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>
            oros.ca · Cliniques dentaires du Québec
          </span>
          <div
            style={{
              background: '#0f766e',
              color: 'white',
              fontSize: '13px',
              fontWeight: 700,
              padding: '8px 18px',
              borderRadius: '8px',
            }}
          >
            Essai gratuit 14 jours
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
