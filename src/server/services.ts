'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { serviceSchema, type ServiceInput } from '@/schemas/service'
import { revalidatePath } from 'next/cache'

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

  revalidatePath('/admin/services')
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

  revalidatePath('/admin/services')
  return { success: true }
}

export async function deleteService(id: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  await prisma.service.delete({
    where: { id, tenantId }
  })

  revalidatePath('/admin/services')
  return { success: true }
}
