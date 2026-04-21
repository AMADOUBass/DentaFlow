import { prisma } from './prisma'
import { AuditAction, AuditCategory } from '@prisma/client'
import { headers } from 'next/headers'

interface AuditParams {
  tenantId: string
  userId: string
  patientId?: string
  action: AuditAction
  category: AuditCategory
  description: string
}

/**
 * Logs a security or data access event.
 * Compliant with Loi 25 requirements for traceability.
 */
export async function logAudit({
  tenantId,
  userId,
  patientId,
  action,
  category,
  description
}: AuditParams) {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        patientId,
        action,
        category,
        description,
        ipAddress: ip,
        userAgent
      }
    })
}
