import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { endpoint, keys, tenantId } = body

  if (!endpoint || !keys?.p256dh || !keys?.auth || !tenantId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh: keys.p256dh, auth: keys.auth },
    create: { tenantId, endpoint, p256dh: keys.p256dh, auth: keys.auth }
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json()
  if (!endpoint) return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 })

  await prisma.pushSubscription.deleteMany({ where: { endpoint } }).catch(() => {})
  return NextResponse.json({ success: true })
}
