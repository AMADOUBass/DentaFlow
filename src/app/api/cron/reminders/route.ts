import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSMS } from '@/lib/sms'
import { addHours, subHours, format } from 'date-fns'

/**
 * CRON JOB - Envoyer les rappels SMS automatisés
 * Ce endpoint est appelé par Vercel Cron ou une tâche planifiée externe.
 */
export async function GET(request: Request) {
  // 1. Sécurité - Vérifier le secret (Bearer Token)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const now = new Date()
  const stats = { sent48h: 0, sent2h: 0, errors: 0 }

  try {
    // --- RAPPEL 48 HEURES ---
    const target48hMin = addHours(now, 47)
    const target48hMax = addHours(now, 49)

    const appointments48h = await prisma.appointment.findMany({
      where: {
        startsAt: { gte: target48hMin, lte: target48hMax },
        reminderSent: false,
        status: { in: ['PENDING', 'CONFIRMED'] },
        patient: { smsOptIn: true }
      },
      include: { patient: true, tenant: true }
    })

    for (const apt of appointments48h) {
      const timeStr = format(apt.startsAt, 'HH:mm')
      const msg = `Rappel: Votre RDV chez ${apt.tenant.name} est dans 48h (a ${timeStr}). Pour annuler, repondez a ce SMS.`
      
      const result = await sendSMS({ to: apt.patient.phone, message: msg })
      if (result.success) {
        await prisma.appointment.update({ where: { id: apt.id }, data: { reminderSent: true } })
        stats.sent48h++
      } else {
        stats.errors++
      }
    }

    // --- RAPPEL 2 HEURES ---
    const target2hMin = addHours(now, 1.5)
    const target2hMax = addHours(now, 2.5)

    const appointments2h = await prisma.appointment.findMany({
      where: {
        startsAt: { gte: target2hMin, lte: target2hMax },
        reminder2hSent: false,
        status: { in: ['PENDING', 'CONFIRMED'] },
        patient: { smsOptIn: true }
      },
      include: { patient: true, tenant: true }
    })

    for (const apt of appointments2h) {
      const timeStr = format(apt.startsAt, 'HH:mm')
      const msg = `Rappel: Votre RDV chez ${apt.tenant.name} est dans 2h (a ${timeStr}). A bientot !`
      
      const result = await sendSMS({ to: apt.patient.phone, message: msg })
      if (result.success) {
        await prisma.appointment.update({ where: { id: apt.id }, data: { reminder2hSent: true } })
        stats.sent2h++
      } else {
        stats.errors++
      }
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('[CRON ERROR]', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
