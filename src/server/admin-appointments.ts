'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { adminAppointmentSchema, type AdminAppointmentInput } from '@/schemas/admin-appointment'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'
import { addMinutes, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { sendEmail } from '@/lib/email'
import { emailCancellation } from '@/lib/email-templates'
import { createNotification } from '@/server/notifications'

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

export async function updateAppointmentStatusAction(id: string, status: any, cancelReason?: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const appointment = await prisma.appointment.findFirst({
    where: { id, tenantId },
    include: {
      patient: true,
      service: true,
      practitioner: true,
      tenant: true,
    }
  })

  if (!appointment) throw new Error('Rendez-vous introuvable')

  await prisma.appointment.update({
    where: { id },
    data: {
      status,
      ...(status === 'CANCELLED' ? { cancelledAt: new Date(), cancelReason: cancelReason ?? 'Annulé par la clinique' } : {})
    }
  })

  // Notifier le patient par email si annulation
  if (status === 'CANCELLED') {
    const dateFormatted = format(appointment.startsAt, 'eeee d MMMM yyyy', { locale: fr })
    const timeFormatted = format(appointment.startsAt, 'HH:mm')

    sendEmail({
      to: appointment.patient.email,
      subject: `Rendez-vous annulé — ${appointment.tenant.name}`,
      html: emailCancellation({
        patientFirstName: appointment.patient.firstName,
        clinicName: appointment.tenant.name,
        clinicPhone: appointment.tenant.phone,
        clinicAddress: appointment.tenant.address ?? undefined,
        practitionerTitle: appointment.practitioner.title,
        practitionerLastName: appointment.practitioner.lastName,
        serviceName: appointment.service.name,
        dateFormatted,
        timeFormatted,
        clinicColor: appointment.tenant.primaryColor,
        reason: cancelReason
      })
    }).catch(() => {})

    // Notification interne
    createNotification({
      tenantId,
      title: 'RDV annulé',
      message: `${appointment.patient.firstName} ${appointment.patient.lastName} — ${dateFormatted} à ${timeFormatted}`,
      type: 'WARNING',
      link: '/admin-area/admin/appointments'
    }).catch(() => {})
  }

  revalidatePath('/admin-area/admin/appointments')
  return { success: true }
}
