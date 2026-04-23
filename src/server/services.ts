'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { serviceSchema, type ServiceInput } from '@/schemas/service'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

export async function createService(data: ServiceInput) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const validatedData = serviceSchema.parse(data)

  const service = await prisma.service.create({
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
    description: `Ajout d'un nouveau service : ${validatedData.name} (Prix: ${validatedData.priceCents ? validatedData.priceCents / 100 : 'N/A'}$, Durée: ${validatedData.durationMin}min).`
  })

  revalidatePath('/admin-area/admin/services')
  return { success: true, id: service.id }
}

export async function updateService(id: string, data: ServiceInput) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const validatedData = serviceSchema.parse(data)

  await prisma.service.update({
    where: { id, tenantId },
    data: validatedData
  })

  await logAudit({
    tenantId,
    userId: user.authId,
    action: 'UPDATE',
    category: 'SYSTEM',
    description: `Modification du service ${validatedData.name} (ID: ${id}).`
  })

  revalidatePath('/admin-area/admin/services')
  return { success: true }
}

export async function deleteService(id: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  await prisma.service.delete({
    where: { id, tenantId }
  })

  await logAudit({
    tenantId,
    userId: user.authId,
    action: 'DELETE',
    category: 'SYSTEM',
    description: `Suppression définitive d'un service (ID: ${id}).`
  })

  revalidatePath('/admin/services')
  return { success: true }
}
