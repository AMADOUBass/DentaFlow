'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { practitionerSchema, type PractitionerInput } from '@/schemas/practitioner'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

import { checkPractitionerLimit } from '@/lib/plan-limits'

export async function createPractitioner(data: PractitionerInput) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const { isLimitReached, limit } = await checkPractitionerLimit(tenantId)
  if (isLimitReached) {
    return { 
      error: `Votre forfait actuel est limité à ${limit === Infinity ? 'beaucoup' : limit} praticien(s). Veuillez passer au forfait supérieur.` 
    }
  }

  const validatedData = practitionerSchema.parse(data)

  const practitioner = await prisma.practitioner.create({
    data: {
      ...validatedData,
      tenantId
    }
  })

  await logAudit({
    tenantId,
    userId: user.authId,
    action: 'CREATE',
    category: 'SYSTEM',
    description: `Ajout d'un nouveau praticien : ${validatedData.firstName} ${validatedData.lastName} (${validatedData.title}).`
  })

  revalidatePath('/admin/practitioners')
  return { success: true, id: practitioner.id }
}

export async function updatePractitioner(id: string, data: PractitionerInput) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const validatedData = practitionerSchema.parse(data)

  await prisma.practitioner.update({
    where: { id, tenantId },
    data: validatedData
  })

  await logAudit({
    tenantId,
    userId: user.authId,
    action: 'UPDATE',
    category: 'SYSTEM',
    description: `Modification des informations du praticien ${validatedData.firstName} ${validatedData.lastName} (ID: ${id}).`
  })

  revalidatePath('/admin/practitioners')
  return { success: true }
}

export async function deletePractitioner(id: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  await prisma.practitioner.delete({
    where: { id, tenantId }
  })

  await logAudit({
    tenantId,
    userId: user.authId,
    action: 'DELETE',
    category: 'SYSTEM',
    description: `Suppression du profil d'un praticien (ID: ${id}).`
  })

  revalidatePath('/admin/practitioners')
  return { success: true }
}
