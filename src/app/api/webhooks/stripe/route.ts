import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { PlanTier } from '@prisma/client'

// Configuration des Price IDs (À mettre à jour avec les vrais IDs Stripe)
const PRICE_TO_TIER: Record<string, PlanTier> = {
  'price_essential_id': PlanTier.ESSENTIEL,
  'price_complet_id': PlanTier.COMPLET,
  'price_premium_id': PlanTier.PREMIUM,
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as any

  // 1. Lorsqu'une session de paiement est complétée
  if (event.type === 'checkout.session.completed') {
    const tenantId = session.metadata?.tenantId
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    // Récupérer le prix pour déterminer le tier
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const priceId = lineItems.data[0]?.price?.id
    const tier = priceId ? PRICE_TO_TIER[priceId] : PlanTier.ESSENTIEL

    if (tenantId) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          stripeCustomer: customerId,
          stripeSubId: subscriptionId,
          planTier: tier || PlanTier.ESSENTIEL,
        }
      })
      console.log(`[STRIPE] Abonnement activé pour le tenant: ${tenantId}`)
    }
  }

  // 2. Lorsqu'une souscription est supprimée (annulation)
  if (event.type === 'customer.subscription.deleted') {
    const subscriptionId = session.id as string
    
    await prisma.tenant.updateMany({
      where: { stripeSubId: subscriptionId },
      data: {
        planTier: PlanTier.ESSENTIEL, // On peut repasser en gratuit ou révoquer l'accès
        stripeSubId: null,
      }
    })
    console.log(`[STRIPE] Abonnement résilié: ${subscriptionId}`)
  }

  // 3. Lorsqu'une souscription est mise à jour (Upgrade/Downgrade)
  if (event.type === 'customer.subscription.updated') {
    const subscriptionId = session.id as string
    const priceId = session.items.data[0].price.id
    const tier = PRICE_TO_TIER[priceId]

    if (tier) {
      await prisma.tenant.updateMany({
        where: { stripeSubId: subscriptionId },
        data: { planTier: tier }
      })
    }
  }

  return NextResponse.json({ received: true })
}
