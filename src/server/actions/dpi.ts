'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

/**
 * Enregistre une condition sur une dent (ex: Carie sur la surface M de la dent 16)
 */
export async function saveToothCondition(data: {
  patientId: string
  toothNumber: number
  surface?: string
  condition: string
  notes?: string
}) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!
  const practitionerId = user.id

  const record = await (prisma as any).toothCondition.create({
    data: {
      ...data,
      tenantId,
      practitionerId
    }
  })

  // Logging Audit
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      patientId: data.patientId,
      action: 'CREATE',
      category: 'MEDICAL_RECORDS',
      description: `Ajout condition dentaire : ${data.condition} sur dent ${data.toothNumber}`
    }
  })

  revalidatePath(`/admin-area/admin/patients/${data.patientId}`)
  return record
}

/**
 * Crée une nouvelle note clinique
 */
export async function createClinicalNote(data: {
  patientId: string
  content: string
  type?: string
}) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!
  const practitionerId = user.id

  const note = await (prisma as any).clinicalNote.create({
    data: {
      tenantId,
      patientId: data.patientId,
      practitionerId,
      content: data.content,
      type: data.type || 'GENERIC'
    }
  })

  revalidatePath(`/admin-area/admin/patients/${data.patientId}`)
  return note
}

/**
 * Verrouille une note clinique (Signature)
 */
export async function lockClinicalNote(noteId: string, patientId: string) {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const note = await (prisma as any).clinicalNote.update({
    where: { id: noteId, tenantId },
    data: {
      isLocked: true,
      lockedAt: new Date()
    }
  })

  // Logging Audit
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      patientId,
      action: 'UPDATE',
      category: 'MEDICAL_RECORDS',
      description: `Signature/Verrouillage d'une note clinique (id: ${noteId})`
    }
  })

  revalidatePath(`/admin-area/admin/patients/${patientId}`)
  return note
}
