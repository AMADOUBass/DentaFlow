'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

const TPS_RATE = 0.05
const TVQ_RATE = 0.09975

/**
 * Crée une facture pour un patient avec gestion de la part assurance
 */
export async function createInvoice(data: {
  patientId: string
  practitionerId: string // Ajouté pour BI
  items: Array<{
    description: string
    actCode?: string
    amount: number
    quantity: number
    isTaxable: boolean
  }>
  insuranceCoveragePercent?: number // ex: 80 pour 80%
}) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  // Calcul des montants
  let subtotal = 0
  let taxTPS = 0
  let taxTVQ = 0

  const itemsData = data.items.map(item => {
    const total = item.amount * item.quantity
    subtotal += total
    if (item.isTaxable) {
      taxTPS += total * TPS_RATE
      taxTVQ += total * TVQ_RATE
    }
    return {
      description: item.description,
      actCode: item.actCode || '00000',
      amount: item.amount,
      quantity: item.quantity,
      isTaxable: item.isTaxable
    }
  })

  const totalAmount = subtotal + taxTPS + taxTVQ
  
  // Calcul de la répartition
  const coverage = data.insuranceCoveragePercent || 0
  const insuranceShare = (subtotal * (coverage / 100))
  const patientShare = totalAmount - insuranceShare

  const invoice = await (prisma as any).invoice.create({
    data: {
      tenantId,
      patientId: data.patientId,
      practitionerId: data.practitionerId, // Lien pour l'analytique
      status: 'DRAFT',
      subtotal,
      taxTPS,
      taxTVQ,
      totalAmount,
      insuranceShare,
      patientShare,
      items: {
        create: itemsData
      }
    },
    include: {
      items: true
    }
  })

  revalidatePath(`/admin-area/admin/patients/${data.patientId}`)
  return invoice
}

/**
 * Enregistre un paiement manuel (Cash, Interac, etc.) ou Assurance
 */
export async function recordPayment(data: {
  invoiceId: string
  amount: number
  method: 'CREDIT_CARD' | 'CASH' | 'DEBIT' | 'INTERAC' | 'INSURANCE' | 'STRIPE'
  reference?: string
  patientId: string
}) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const payment = await (prisma as any).payment.create({
    data: {
      tenantId,
      invoiceId: data.invoiceId,
      amount: data.amount,
      method: data.method,
      reference: data.reference
    }
  })

  // Vérifier si la facture est totalement payée
  const invoice = await (prisma as any).invoice.findUnique({
    where: { id: data.invoiceId },
    include: { payments: true }
  })

  const totalPaid = (invoice.payments as any[]).reduce((sum, p) => sum + p.amount, 0)
  
  if (totalPaid >= invoice.totalAmount) {
    await (prisma as any).invoice.update({
      where: { id: data.invoiceId },
      data: { status: 'PAID' }
    })
  }

  revalidatePath(`/admin-area/admin/patients/${data.patientId}`)
  return payment
}
