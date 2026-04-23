'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlots } from '@/lib/availability'
import { appointmentSchema, type AppointmentInput } from '@/schemas/appointment'
import { AppointmentStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { parse, format, isBefore, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { sendEmail } from '@/lib/email'
import { sendSMS } from '@/lib/sms'

/**
 * Action to fetch available slots for a given date/practitioner/service
 */
export async function getAvailableSlotsAction(
  tenantId: string, 
  practitionerId: string, 
  serviceId: string, 
  date: string
) {
  try {
    const slots = await getAvailableSlots({
      tenantId,
      practitionerId,
      serviceId,
      date
    })
    return { success: true, slots }
  } catch (error) {
    return { success: false, error: "Erreur lors du calcul des disponibilités" }
  }
}

/**
 * Creates a new appointment and potentially a new patient
 */
export async function createAppointment(tenantId: string, data: AppointmentInput) {
  const result = appointmentSchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: "Données invalides" }
  }

  const { 
    serviceId, 
    practitionerId, 
    date, 
    slot, 
    email, 
    firstName, 
    lastName, 
    phone,
    notes,
    insuranceId,
    insurancePolicy
  } = result.data

  // 1. Find or create patient
  let patient = await prisma.patient.findUnique({
    where: { 
      tenantId_email: { tenantId, email } 
    }
  })

  if (patient) {
    // Check for active appointment (PENDING or CONFIRMED)
    const activeAppointment = await prisma.appointment.findFirst({
      where: {
        patientId: patient.id,
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] }
      }
    })

    if (activeAppointment) {
      if (activeAppointment.status === AppointmentStatus.PENDING) {
        // Supprime l'ancien rendez-vous en attente pour permettre de recommencer
        await prisma.appointment.delete({ where: { id: activeAppointment.id } })
      } else {
        return { 
          success: false, 
          error: "Vous avez déjà un rendez-vous actif dans cette clinique. Veuillez annuler le précédent avant d'en choisir un nouveau." 
        }
      }
    }
  } else {
    patient = await prisma.patient.create({
      data: {
        tenantId,
        email,
        firstName,
        lastName,
        phone
      }
    })
  }

  // 2. Determine practitioner if 'any' was chosen
  let finalPractitionerId = practitionerId
  if (practitionerId === 'any') {
    const availableSlotsWithPrac = await getAvailableSlotsAction(tenantId, 'any', serviceId, date)
    // In a real 'any' scenario, we'd need to know WHICH practitioner has this slot.
    // Simplifying: Fetch practitioners offering service and pick the first one available at this slot.
    const eligiblePractitioners = await prisma.practitioner.findMany({
      where: {
        tenantId,
        services: { some: { serviceId } }
      }
    })
    
    for (const prac of eligiblePractitioners) {
      const pracSlots = await getAvailableSlots({
        tenantId,
        practitionerId: prac.id,
        serviceId,
        date
      })
      if (pracSlots.includes(slot)) {
        finalPractitionerId = prac.id
        break
      }
    }
  }

  // 3. Create appointment
  const service = await prisma.service.findUnique({ 
    where: { id: serviceId, tenantId } 
  })
  if (!service) return { success: false, error: "Service non trouvé" }

  const startTime = parse(`${date} ${slot}`, 'yyyy-MM-dd HH:mm', new Date())
  const endTime = new Date(startTime.getTime() + service.durationMin * 60000)

  const appointment = await prisma.appointment.create({
    data: {
      tenantId,
      patientId: patient.id,
      practitionerId: finalPractitionerId,
      serviceId,
      startsAt: startTime,
      endsAt: endTime,
      status: AppointmentStatus.PENDING,
      notes,
    }
  })

  revalidatePath('/admin-area/admin/dashboard')
  return { success: true, id: appointment.id, patientId: patient.id }
}

/**
 * Confirms a PENDING appointment and sends SMS + email notifications.
 * Called after deposit payment (via Stripe webhook) or directly for free services.
 */
export async function confirmAndNotifyAppointment(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true,
      service: true,
      practitioner: true,
      tenant: true,
    },
  })

  if (!appointment) throw new Error('Rendez-vous introuvable')

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: AppointmentStatus.CONFIRMED },
  })

  const { patient, service, practitioner, tenant } = appointment
  const formattedDate = format(appointment.startsAt, 'eeee d MMMM yyyy', { locale: fr })
  const formattedTime = format(appointment.startsAt, 'HH:mm')

  await sendEmail({
    to: patient.email,
    subject: `Confirmation de votre rendez-vous - ${tenant.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 800;">Rendez-vous confirmé !</h1>
        <p>Bonjour ${patient.firstName},</p>
        <p>Votre rendez-vous chez ${tenant.name} a été enregistré avec succès.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Soin</p>
          <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 18px;">${service.name}</p>
          <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Praticien</p>
          <p style="margin: 0 0 10px 0; font-weight: bold;">${practitioner.title} ${practitioner.lastName}</p>
          <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Date & Heure</p>
          <p style="margin: 0; font-weight: bold;">${formattedDate} à ${formattedTime}</p>
        </div>
        <p>Adresse: ${tenant.address || 'Voir site web'}</p>
        <p>Téléphone: ${tenant.phone || ''}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">Ce courriel a été envoyé automatiquement par Oros pour ${tenant.name}.</p>
      </div>
    `,
  })

  await sendSMS({
    to: patient.phone,
    message: `Bonjour ${patient.firstName}, votre RDV chez ${tenant.name} est confirme pour le ${formattedDate} a ${formattedTime}.`,
  })
}

export async function cancelAppointmentAction(appointmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    throw new Error('Non authentifié')
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true }
  })
  
  // Check for ownership if needed, but since we check email below, it's safe.
  if (!appointment) {
    throw new Error('Rendez-vous non trouvé')
  }

  if (!appointment || appointment.patient.email !== user.email) {
    throw new Error('Rendez-vous non trouvé ou non autorisé')
  }

  // Security: Check 24h delay
  const limit = addDays(new Date(), 1)
  if (isBefore(appointment.startsAt, limit)) {
    throw new Error('Délai d\'annulation dépassé (moins de 24h)')
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: AppointmentStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelReason: 'Annulé par le patient via le portail'
    }
  })


  revalidatePath('/[tenant]/portail', 'layout')
  return { success: true }
}

/**
 * Saves medical questionnaire for a patient
 */
export async function saveMedicalQuestionnaireAction(tenantId: string, patientId: string, data: any) {
  try {
    const questionnaire = await prisma.medicalQuestionnaire.upsert({
      where: { patientId },
      update: {
        ...data,
        updatedAt: new Date()
      },
      create: {
        tenantId,
        patientId,
        ...data
      }
    })


    return { success: true, id: questionnaire.id }
  } catch (error) {
    console.error("Erreur Questionnaire:", error)
    return { success: false, error: "Erreur lors de la sauvegarde du bilan médical" }
  }
}
