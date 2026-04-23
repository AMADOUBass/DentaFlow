'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

export async function getMedicalQuestionnaire(tenantId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('Non authentifié')

  const patient = await prisma.patient.findUnique({
    where: { tenantId_email: { tenantId, email: user.email } },
    include: { questionnaire: true }
  })

  return patient?.questionnaire || null
}

export async function saveMedicalQuestionnaire(tenantId: string, data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('Non authentifié')

  const patient = await prisma.patient.findUnique({
    where: { tenantId_email: { tenantId, email: user.email } }
  })

  if (!patient) throw new Error('Patient non trouvé')

  const { conditions, ...rest } = data

  const questionnaire = await prisma.medicalQuestionnaire.upsert({
    where: { patientId: patient.id },
    create: {
      ...rest,
      conditions: conditions || [],
      patientId: patient.id,
      tenantId: tenantId
    },
    update: {
      ...rest,
      conditions: conditions || [],
    }
  })

  await logAudit({
    tenantId,
    userId: user.id,
    patientId: patient.id,
    action: 'UPDATE',
    category: 'MEDICAL_RECORDS',
    description: 'Mise à jour du questionnaire médical par le patient.'
  })

  revalidatePath('/portail/questionnaire')
  return questionnaire
}
