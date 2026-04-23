'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

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

  await logAudit({
    tenantId,
    userId: user.authId,
    action: 'UPDATE',
    category: 'PATIENT_DATA',
    description: `Marquage d'une urgence comme ${!emergency.handled ? 'traitée' : 'non-traitée'} (Patient: ${emergency.firstName} ${emergency.lastName}).`
  })

  revalidatePath('/admin-area/admin/dashboard')
  revalidatePath('/admin-area/admin/emergencies')
}

import { EmergencyInput } from '@/schemas/emergency'

export async function submitEmergencyRequest(tenantId: string, data: EmergencyInput) {
  const emergency = await prisma.emergencyRequest.create({
    data: {
      tenantId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      painLevel: data.painLevel,
      category: data.category,
      description: data.description,
    }
  })

  await logAudit({
    tenantId,
    userId: 'SYSTEM',
    action: 'CREATE',
    category: 'PATIENT_DATA',
    description: `Nouvelle demande d'urgence soumise par ${data.firstName} ${data.lastName} (Niveau: ${data.painLevel}).`
  })

  revalidatePath('/admin-area/admin/dashboard')
  return { success: true, id: emergency.id }
}
