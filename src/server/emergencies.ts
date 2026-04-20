'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

export async function toggleEmergencyHandled(id: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const emergency = await prisma.emergencyRequest.findFirst({
    where: { id, tenantId }
  })

  if (!emergency) {
    throw new Error('Urgence non trouvée')
  }

  await prisma.emergencyRequest.update({
    where: { id },
    data: { handled: !emergency.handled }
  })

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/emergencies')
}

export async function submitEmergencyRequest(tenantId: string, data: any) {
  const emergency = await prisma.emergencyRequest.create({
    data: {
      tenantId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      painLevel: parseInt(data.painLevel),
      category: data.category,
      description: data.description,
    }
  })

  revalidatePath('/admin/dashboard')
  return { success: true, id: emergency.id }
}
