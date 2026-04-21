import { PlanTier } from '@prisma/client'
import { prisma } from './prisma'

/**
 * Définition des quotas officiels par forfait
 */
export const PLAN_LIMITS = {
  [PlanTier.ESSENTIEL]: {
    practitioners: 1,
    aiEmergency: false,
    unlimitedSms: false,
    advancedStats: false,
  },
  [PlanTier.COMPLET]: {
    practitioners: 3,
    aiEmergency: true,
    unlimitedSms: true,
    advancedStats: false,
  },
  [PlanTier.PREMIUM]: {
    practitioners: Infinity,
    aiEmergency: true,
    unlimitedSms: true,
    advancedStats: true,
  },
} as const

/**
 * Vérifie si un tenant a atteint sa limite de praticiens
 */
export async function checkPractitionerLimit(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { planTier: true }
  })

  if (!tenant) throw new Error('Tenant introuvable')

  const count = await prisma.practitioner.count({
    where: { tenantId, active: true }
  })

  const limit = PLAN_LIMITS[tenant.planTier].practitioners

  return {
    count,
    limit,
    isLimitReached: count >= limit,
    planTier: tenant.planTier
  }
}

/**
 * Helper pour obtenir les limites actuelles d'un tenant
 */
export async function getTenantLimits(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { planTier: true }
  })

  if (!tenant) throw new Error('Tenant introuvable')

  return PLAN_LIMITS[tenant.planTier]
}
