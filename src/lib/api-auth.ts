import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export type AuthedTenant = { tenantId: string; apiKeyId: string }

export async function validateApiKey(req: NextRequest): Promise<AuthedTenant | NextResponse> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header. Use: Bearer <api_key>' },
      { status: 401 }
    )
  }

  const rawKey = authHeader.slice(7)
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex')

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      keyHash,
      revokedAt: null
    },
    include: {
      tenant: { select: { id: true, planTier: true, isActive: true } }
    }
  })

  if (!apiKey) {
    return NextResponse.json({ error: 'Invalid or revoked API key.' }, { status: 401 })
  }

  if (!apiKey.tenant.isActive) {
    return NextResponse.json({ error: 'Clinic account is inactive.' }, { status: 403 })
  }

  if (apiKey.tenant.planTier !== 'PREMIUM') {
    return NextResponse.json(
      { error: 'API access requires a Premium plan.' },
      { status: 403 }
    )
  }

  // Update lastUsedAt asynchronously
  ;prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }
  }).catch(() => {})

  return { tenantId: apiKey.tenant.id, apiKeyId: apiKey.id }
}
