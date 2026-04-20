'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { practitionerSchema, type PractitionerInput } from '@/schemas/practitioner'
import { revalidatePath } from 'next/cache'

export async function createPractitioner(data: PractitionerInput) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const validatedData = practitionerSchema.parse(data)

  const practitioner = await prisma.practitioner.create({
    data: {
      ...validatedData,
      tenantId
    }
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

  revalidatePath('/admin/practitioners')
  return { success: true }
}

export async function deletePractitioner(id: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  await prisma.practitioner.delete({
    where: { id, tenantId }
  })

  revalidatePath('/admin/practitioners')
  return { success: true }
}
