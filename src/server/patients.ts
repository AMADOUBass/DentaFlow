'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { patientProfileSchema, adminPatientSchema, type PatientProfileInput, type AdminPatientInput } from '@/schemas/patient'
import { revalidatePath } from 'next/cache'
import { encrypt, decrypt } from '@/lib/crypto'
import { logAudit } from '@/lib/audit'

export async function updatePatientProfile(tenantId: string, data: PatientProfileInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    throw new Error('Non authentifié')
  }

  const validatedData = patientProfileSchema.parse(data)

  // Enforce encryption for sensitive fields
  if (validatedData.ramqNumber) {
    validatedData.ramqNumber = encrypt(validatedData.ramqNumber)
  }

  await prisma.patient.update({
    where: { 
      tenantId_email: { 
        tenantId, 
        email: user.email 
      } 
    },
    data: validatedData
  })

  revalidatePath('/[tenant]/portail', 'layout')
  return { success: true }
}

/**
 * Admin action to fetch a patient's full record with audit logging.
 * Compliant with Loi 25 (Access log).
 */
export async function getPatientDetail(tenantId: string, patientId: string) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) throw new Error('Non authentifié')

  // Log the access event immediately
  await logAudit({
    tenantId,
    userId: authUser.id,
    patientId,
    action: 'VIEW',
    category: 'PATIENT_DATA',
    description: `Consultation de la fiche détaillée du patient.`
  })

  const patient = await prisma.patient.findUnique({
    where: { id: patientId, tenantId },
    include: {
      insuranceProvider: true,
      appointments: {
        orderBy: { startsAt: 'desc' },
        take: 10
      }
    }
  })

  if (!patient) return null

  // Decrypt sensitive data before returning to the secure Admin UI
  return {
    ...patient,
    ramqNumber: patient.ramqNumber ? decrypt(patient.ramqNumber) : null,
    medicalNotes: patient.medicalNotes ? decrypt(patient.medicalNotes) : null
  }
}

/**
 * Admin action to create a new patient with encrypted data.
 */
export async function createPatientAdmin(_: string, data: AdminPatientInput) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) throw new Error('Non authentifié')

  // Récupérer le tenantId de l'utilisateur admin
  const adminUser = await prisma.user.findUnique({
    where: { authId: authUser.id }
  })

  if (!adminUser?.tenantId) throw new Error('Tenant non trouvé pour cet utilisateur')
  const tenantId = adminUser.tenantId

  // Encrypt sensitive fields
  const finalData = { ...data, tenantId }
  if (finalData.ramqNumber) finalData.ramqNumber = encrypt(finalData.ramqNumber)
  if (finalData.medicalNotes) finalData.medicalNotes = encrypt(finalData.medicalNotes)

  const patient = await prisma.patient.create({
    data: finalData
  })

  await logAudit({
    tenantId,
    userId: adminUser.id,
    patientId: patient.id,
    action: 'CREATE',
    category: 'PATIENT_DATA',
    description: `Création manuelle d'une fiche patient par le personnel.`
  })

  revalidatePath('/admin-area/admin/patients')
  return { success: true, patient }
}

/**
 * Admin action to update an existing patient.
 */
export async function updatePatientAdminAction(patientId: string, data: Partial<AdminPatientInput>) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) throw new Error('Non authentifié')

  const adminUser = await prisma.user.findUnique({
    where: { authId: authUser.id }
  })

  if (!adminUser?.tenantId) throw new Error('Tenant non trouvé')
  const tenantId = adminUser.tenantId

  // Encrypt sensitive fields if they are being updated
  const updateData = { ...data }
  if (updateData.ramqNumber) updateData.ramqNumber = encrypt(updateData.ramqNumber)
  if (updateData.medicalNotes) updateData.medicalNotes = encrypt(updateData.medicalNotes)

  const patient = await prisma.patient.update({
    where: { id: patientId, tenantId },
    data: updateData
  })

  await logAudit({
    tenantId,
    userId: adminUser.id,
    patientId: patient.id,
    action: 'UPDATE',
    category: 'PATIENT_DATA',
    description: `Mise à jour de la fiche patient par le personnel.`
  })

  revalidatePath('/admin-area/admin/patients')
  revalidatePath(`/admin-area/admin/patients/${patientId}`)
  return { success: true, patient }
}

/**
 * Admin action to permanently delete a patient (Droit à l'oubli - Loi 25).
 */
export async function deletePatientAction(_: string, patientId: string) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) throw new Error('Non authentifié')

  const adminUser = await prisma.user.findUnique({
    where: { authId: authUser.id }
  })

  if (!adminUser?.tenantId) throw new Error('Tenant non trouvé')
  const tenantId = adminUser.tenantId

  // Log the deletion BEFORE deleting (so we know who did it)
  await logAudit({
    tenantId,
    userId: adminUser.id,
    patientId,
    action: 'DELETE',
    category: 'PATIENT_DATA',
    description: `Suppression définitive du patient (Droit à l'oubli).`
  })

  await prisma.patient.delete({
    where: { id: patientId, tenantId }
  })

  revalidatePath('/admin-area/admin/patients')
  return { success: true }
}
