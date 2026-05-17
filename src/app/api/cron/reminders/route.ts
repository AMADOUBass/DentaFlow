import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSMS } from '@/lib/sms'
import { sendEmail } from '@/lib/email'
import { emailReminder24h } from '@/lib/email-templates'
import { sendPushNotification } from '@/lib/push'
import { addHours, format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  const stats = { sent48h: 0, sent2h: 0, sentEmail24h: 0, sentPush24h: 0, errors: 0 }

  try {
    // --- RAPPEL EMAIL + PUSH 24 HEURES ---
    const target24hMin = addHours(now, 23)
    const target24hMax = addHours(now, 25)

    const appointments24h = await prisma.appointment.findMany({
      where: {
        startsAt: { gte: target24hMin, lte: target24hMax },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        patient: true,
        tenant: true,
        service: true,
        practitioner: true,
      }
    })

    for (const apt of appointments24h) {
      const dateFormatted = format(apt.startsAt, 'eeee d MMMM yyyy', { locale: fr })
      const timeFormatted = format(apt.startsAt, 'HH:mm')

      // Email rappel 24h
      const emailResult = await sendEmail({
        to: apt.patient.email,
        subject: `Rappel — Votre rendez-vous demain chez ${apt.tenant.name}`,
        html: emailReminder24h({
          patientFirstName: apt.patient.firstName,
          clinicName: apt.tenant.name,
          clinicPhone: apt.tenant.phone,
          clinicAddress: apt.tenant.address ?? undefined,
          practitionerTitle: apt.practitioner.title,
          practitionerLastName: apt.practitioner.lastName,
          serviceName: apt.service.name,
          dateFormatted,
          timeFormatted,
          clinicColor: apt.tenant.primaryColor,
        })
      })
      if (emailResult.success) stats.sentEmail24h++

      // Push PWA 24h
      const pushSubs = await prisma.pushSubscription.findMany({
        where: { tenantId: apt.tenantId }
      })
      for (const sub of pushSubs) {
        const ok = await sendPushNotification(sub, {
          title: `Rappel RDV — ${apt.tenant.name}`,
          body: `${apt.service.name} demain à ${timeFormatted}`,
          icon: '/icon.png',
          url: '/portail/rendez-vous'
        })
        if (ok) stats.sentPush24h++
        else {
          // Supprimer abonnement expiré
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
        }
      }
    }

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
