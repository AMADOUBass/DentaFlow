'use server'

import { createCheckoutSession, createBillingPortalSession } from '@/lib/stripe'
import { getAdminUser } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

/**
 * Redirige vers Stripe Checkout pour s'abonner
 */
export async function startSubscriptionAction(priceId: string) {
  const user = await getAdminUser()
  if (!user.tenantId) throw new Error('Tenant ID manquant')

  const session = await createCheckoutSession(
    user.tenantId,
    priceId,
    user.email
  )

  if (session.url) {
    redirect(session.url)
  }
}

/**
 * Redirige vers le portail de gestion Stripe
 */
export async function openBillingPortalAction() {
  const user = await getAdminUser()
  if (!user.tenantId) throw new Error('Tenant ID manquant')

  // On récupère le customerId en DB (on doit d'abord s'assurer qu'il existe)
  // Pour simplifier ici, on suppose que le tenant a déjà un stripeCustomer
  // Dans une vraie app, on ferait un findUnique sur le Tenant.
  const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } })
  if (!tenant?.stripeCustomer) throw new Error('Aucun compte client Stripe trouvé')

  const session = await createBillingPortalSession(tenant.stripeCustomer)

  if (session.url) {
    redirect(session.url)
  }
}
