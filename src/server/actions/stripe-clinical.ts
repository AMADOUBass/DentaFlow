'use server'

import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'

/**
 * Crée une session Stripe Checkout pour le dépôt d'un rendez-vous public.
 * Appelé depuis le PaymentStep du wizard de réservation.
 */
export async function createDepositCheckoutSession(appointmentId: string, tenantSlug: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, service: true, tenant: true },
  })

  if (!appointment) throw new Error('Rendez-vous introuvable')
  if (!appointment.service.depositAmountCents) throw new Error('Ce service ne requiert pas de dépôt')

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
  const protocol = rootDomain.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${tenantSlug}.${rootDomain}`

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: `Acompte — ${appointment.service.name}`,
            description: `Garantie de réservation chez ${appointment.tenant.name}. Montant déduit de votre facture finale.`,
          },
          unit_amount: appointment.service.depositAmountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: appointment.patient.email,
    success_url: `${baseUrl}/rendez-vous?payment=success`,
    cancel_url: `${baseUrl}/rendez-vous`,
    metadata: {
      type: 'DEPOSIT',
      appointmentId: appointment.id,
      tenantId: appointment.tenantId,
    },
  })

  return { url: session.url }
}

/**
 * Crée une session de paiement Stripe pour une facture clinique
 * @param invoiceId L'ID de la facture à payer
 */
export async function createClinicalInvoiceSession(invoiceId: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const invoice = await (prisma as any).invoice.findUnique({
    where: { id: invoiceId, tenantId },
    include: { patient: true }
  })

  if (!invoice) throw new Error('Facture non trouvée')

  // Le patient ne paie que sa part (patientShare)
  // Stripe attend des montants en cents
  const amountToPay = Math.round(invoice.patientShare * 100)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: `Paiement - Facture #${invoice.id.slice(-6)}`,
            description: `Soins dentaires pour ${invoice.patient.firstName} ${invoice.lastName}`,
          },
          unit_amount: amountToPay,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/portail/factures?success=true&invoiceId=${invoiceId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/portail/factures?canceled=true`,
    customer_email: invoice.patient.email,
    metadata: {
      type: 'CLINICAL_INVOICE',
      invoiceId: invoice.id,
      tenantId: tenantId,
    },
  })

  // Enregistrer le session ID sur la facture pour suivi
  await (prisma as any).invoice.update({
    where: { id: invoiceId },
    data: { stripeSessionId: session.id }
  })

  return { url: session.url }
}
