'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'

/**
 * Generate a complete JSON export of all tenant data.
 * This is a requirement for Law 25 (Data Portability).
 */
export async function exportFullClinicDataAction() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  console.log(`[EXPORT] Starting full export for tenant: ${tenantId}`)

  // Fetch all related entities in parallel
  const [
    tenant,
    practitioners,
    services,
    patients,
    appointments,
    invoices,
    auditLogs,
    notifications
  ] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId } }),
    prisma.practitioner.findMany({ where: { tenantId } }),
    prisma.service.findMany({ where: { tenantId } }),
    prisma.patient.findMany({ 
      where: { tenantId },
      include: {
        clinicalNotes: true,
        toothConditions: true,
        prescriptions: true,
        media: true
      }
    }),
    prisma.appointment.findMany({ where: { tenantId } }),
    prisma.invoice.findMany({ 
      where: { tenantId },
      include: { items: true, payments: true }
    }),
    prisma.auditLog.findMany({ where: { tenantId } }),
    prisma.notification.findMany({ where: { tenantId } })
  ])

  const exportData = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    clinic: tenant,
    practitioners,
    services,
    patients,
    appointments,
    invoices,
    auditLogs,
    notifications
  }

  // Create an audit log for this massive export
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: user.id,
      action: 'EXPORT',
      category: 'SECURITY',
      description: "Exportation complète des données de la clinique (Portabilité Loi 25)",
    }
  })

  return exportData
}
