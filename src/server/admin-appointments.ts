'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { adminAppointmentSchema, type AdminAppointmentInput } from '@/schemas/admin-appointment'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'
import { addMinutes } from 'date-fns'

export async function createAppointmentAdmin(data: AdminAppointmentInput) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const validatedData = adminAppointmentSchema.parse(data)

  // Récupérer la durée du service pour calculer endsAt
  const service = await prisma.service.findUnique({
    where: { id: validatedData.serviceId, tenantId }
  })

  if (!service) throw new Error('Service non trouvé')

  const endsAt = addMinutes(validatedData.startsAt, service.durationMin)

  const appointment = await prisma.appointment.create({
    data: {
      tenantId,
      patientId: validatedData.patientId,
      practitionerId: validatedData.practitionerId,
      serviceId: validatedData.serviceId,
      startsAt: validatedData.startsAt,
      endsAt,
      status: validatedData.status,
      notes: validatedData.notes
    }
  })

  await logAudit({
    tenantId,
    userId: user.authId,
    patientId: validatedData.patientId,
    action: 'CREATE',
    category: 'PATIENT_DATA',
    description: `Nouveau rendez-vous créé manuellement par l'admin.`
  })

  revalidatePath('/admin-area/admin/appointments')
  return { success: true, appointment }
}

export async function updateAppointmentStatusAction(id: string, status: any) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  await prisma.appointment.update({
    where: { id, tenantId },
    data: { status }
  })

  revalidatePath('/admin-area/admin/appointments')
  return { success: true }
}
