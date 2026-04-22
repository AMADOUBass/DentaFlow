import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { PlanTier } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature')!

  let event: Stripe.Event
  let logEntryId: string | null = null

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Log initial event reception
    const log = await prisma.webhookLog.create({
      data: {
        type: event.type,
        provider: 'STRIPE',
        payload: event.data.object as any,
        status: 'RECEIVED'
      }
    })
    logEntryId = log.id

    console.log(`[STRIPE] Événement reçu: ${event.type}`)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const tenantId = session.metadata?.tenantId
      const subscriptionId = session.subscription as string
      const customerId = session.customer as string
      const tier = session.metadata?.tier as PlanTier

      if (tenantId) {
        await prisma.tenant.update({
          where: { id: tenantId },
          data: {
            stripeCustomer: customerId,
            stripeSubId: subscriptionId,
            planTier: tier || PlanTier.ESSENTIEL,
            isActive: true, // Activation automatique après paiement
          }
        })
        console.log(`[STRIPE] Abonnement activé pour le tenant: ${tenantId}`)
      }
    }

    if (event.type === 'invoice.paid') {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      
      // On peut marquer les factures locales comme payées ici si nécessaire
      console.log(`[STRIPE] Facture payée pour le client: ${customerId}`)
    }

    // Update log to success
    if (logEntryId) {
      await prisma.webhookLog.update({
        where: { id: logEntryId },
        data: { status: 'SUCCESS' }
      })
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    
    if (logEntryId) {
      await prisma.webhookLog.update({
        where: { id: logEntryId },
        data: { status: 'ERROR', error: message }
      })
    } else {
      await prisma.webhookLog.create({
        data: { type: 'ERROR_CONSTRUCT', provider: 'STRIPE', status: 'ERROR', error: message }
      })
    }
    
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }
}
