'use server'

import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'

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
