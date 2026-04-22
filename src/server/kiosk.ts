'use server'

import { prisma } from '@/lib/prisma'
import { createNotification } from './notifications'
import { getAdminUser } from '@/lib/auth-utils'

export async function checkInPatientAction(lastName: string, birthDate: string) {
  // En mode Kiosque, on doit identifier le tenant via le domaine/contexte
  // Pour la démo, on récupère le tenant du premier admin (à affiner en prod)
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const patient = await prisma.patient.findFirst({
    where: {
      tenantId,
      lastName: { equals: lastName, mode: 'insensitive' }
      // On pourrait aussi filtrer par date de naissance si présente en DB
    }
  })

  if (patient) {
    await createNotification({
      tenantId,
      title: "Arrivée Patient (Kiosque)",
      message: `${patient.firstName} ${patient.lastName} vient d'arriver et attend en salle d'attente.`,
      type: 'SUCCESS'
    })
    return { success: true, patientName: patient.firstName }
  }

  return { success: false, error: 'Patient non trouvé' }
}
