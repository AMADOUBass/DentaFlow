import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { addDays, startOfDay, endOfDay } from 'date-fns'

// This endpoint should be protected, e.g. via Vercel Cron Secret
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const todayStart = startOfDay(new Date())
  const todayEnd = endOfDay(new Date())

  const inTwoDaysStart = startOfDay(addDays(new Date(), 2))
  const inTwoDaysEnd = endOfDay(addDays(new Date(), 2))

  try {
    // 1. Rappel à J+12 (2 jours avant expiration)
    const warningTenants = await prisma.tenant.findMany({
      where: {
        stripeSubId: null,
        trialEndsAt: {
          gte: inTwoDaysStart,
          lte: inTwoDaysEnd
        }
      }
    })

    for (const tenant of warningTenants) {
      await sendEmail({
        to: tenant.email,
        subject: 'Votre essai gratuit Oros expire dans 2 jours',
        html: `
          <h1>Bonjour ${tenant.name},</h1>
          <p>Votre période d'essai gratuit de 14 jours se termine dans exactement 2 jours.</p>
          <p>Pour éviter toute interruption de service et conserver l'accès à votre espace d'administration, veuillez choisir un forfait dès aujourd'hui.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin-area/setup/pricing">Choisir un forfait</a>
        `
      })
    }

    // 2. Notification J+14 (Jour de l'expiration)
    const expiredTenants = await prisma.tenant.findMany({
      where: {
        stripeSubId: null,
        trialEndsAt: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    })

    for (const tenant of expiredTenants) {
      await sendEmail({
        to: tenant.email,
        subject: 'Votre essai gratuit Oros est terminé',
        html: `
          <h1>Bonjour ${tenant.name},</h1>
          <p>Votre période d'essai gratuit est maintenant terminée.</p>
          <p>Votre accès à l'administration a été restreint. Pour réactiver votre compte et continuer à utiliser Oros, veuillez vous abonner.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin-area/setup/trial-expired">Réactiver mon compte</a>
        `
      })
    }

    return NextResponse.json({ 
      success: true, 
      remindersSent: warningTenants.length,
      expirationsSent: expiredTenants.length
    })

  } catch (error) {
    console.error('Error in trial-reminders cron:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
