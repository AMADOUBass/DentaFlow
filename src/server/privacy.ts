'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/crypto'
import { logAudit } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

/**
 * Exports all patient data in JSON format.
 * Compliant with Right to Portability (Loi 25).
 */
export async function exportPatientData(tenantId: string) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser || !authUser.email) throw new Error('Non authentifié')

  const patient = await prisma.patient.findUnique({
    where: { tenantId_email: { tenantId, email: authUser.email } },
    include: {
      appointments: {
        include: { service: true, practitioner: true }
      },
      insuranceProvider: true
    }
  })

  if (!patient) throw new Error('Patient non trouvé')

  // Log the export action
  await logAudit({
    tenantId,
    userId: authUser.id,
    patientId: patient.id,
    action: 'EXPORT',
    category: 'PATIENT_DATA',
    description: `Le patient a exporté l'intégralité de son dossier au format JSON.`
  })

  // Decrypt sensitive parts for the export
  const exportData = {
    ...patient,
    ramqNumber: patient.ramqNumber ? decrypt(patient.ramqNumber) : null,
    medicalNotes: patient.medicalNotes ? decrypt(patient.medicalNotes) : null,
    exportedAt: new Date().toISOString(),
    compliance: "Loi 25 (Québec) - Portabilité des données"
  }

  return exportData
}

/**
 * Anonymizes or marks a patient record for deletion.
 * Compliant with Right to be Forgotten (Loi 25).
 */
export async function deletePatientRecord(tenantId: string) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser || !authUser.email) throw new Error('Non authentifié')

  const patient = await prisma.patient.findUnique({
    where: { tenantId_email: { tenantId, email: authUser.email } }
  })

  if (!patient) throw new Error('Patient non trouvé')

  // Log the deletion request
  await logAudit({
    tenantId,
    userId: authUser.id,
    patientId: patient.id,
    action: 'DELETE',
    category: 'PATIENT_DATA',
    description: `Demande de suppression de compte initiée par le patient.`
  })

  // In a medical context, we often "Archive/Anonymize" instead of hard delete 
  // to keep medical records for legal duration (7-10 years), but we remove access.
  // For this demo, we'll do a soft delete or just remove identifying info.
  
  await prisma.patient.update({
    where: { id: patient.id },
    data: {
      email: `deleted_${patient.id}@dentaflow.ca`,
      phone: '000-000-0000',
      ramqNumber: null,
      address: 'SUPPRIMÉ',
      authId: null // Unlink from auth
    }
  })

  // Note: We would also need to delete the Supabase Auth user here if needed
  // using supabase.auth.admin.deleteUser (requires service role)

  revalidatePath('/', 'layout')
  return { success: true }
}
