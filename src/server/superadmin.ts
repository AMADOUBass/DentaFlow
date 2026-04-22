'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@prisma/client'

/**
 * Accès réservé au SuperAdmin pour la gestion de la plateforme
 */
async function ensureSuperAdmin() {
  const user = await getAdminUser()
  if (user.role !== UserRole.SUPERADMIN) {
    throw new Error('Action réservée aux administrateurs de la plateforme')
  }
  return user
}

/**
 * Liste toutes les cliniques avec leur statut
 */
export async function getTenantsAction() {
  await ensureSuperAdmin()
  
  return prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { users: true, patients: true }
      }
    }
  })
}

/**
 * Met à jour le statut de validation ou d'activation d'une clinique
 */
export async function updateTenantStatusAction(id: string, data: { isValidated?: boolean, isActive?: boolean }) {
  await ensureSuperAdmin()
  
  const tenant = await prisma.tenant.update({
    where: { id },
    data
  })
  
  revalidatePath('/admin-area/superadmin/tenants')
  return tenant
}

/**
 * Statistiques globales de la plateforme
 */
export async function getPlatformStatsAction() {
  await ensureSuperAdmin()
  
  const [totalTenants, activeTenants, validatedTenants, totalRevenue, totalUsers] = await Promise.all([
    prisma.tenant.count(),
    prisma.tenant.count({ where: { isActive: true } }),
    prisma.tenant.count({ where: { isValidated: true } }),
    prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { totalAmount: true }
    }),
    prisma.user.count()
  ])

  return {
    totalTenants,
    activeTenants,
    validatedTenants,
    estimatedRevenue: totalRevenue._sum.totalAmount || 0,
    totalUsers
  }
}

/**
 * Récupère les logs d'audit de toute la plateforme (Loi 25)
 */
export async function getGlobalAuditLogsAction(limit = 20) {
  await ensureSuperAdmin()
  
  return (prisma as any).auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      tenant: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } }
    }
  })
}

/**
 * Récupère les données de croissance pour les graphiques
 */
export async function getGrowthStatsAction() {
  await ensureSuperAdmin()
  
  // Simulation de données historiques pour le graphique AreaChart
  // En prod, on ferait des agrégations par mois
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const tenantGrowth = [5, 12, 18, 25, 32, 45]
  const revenueGrowth = [12000, 25000, 45000, 68000, 92000, 115000]

  return {
    revenueTrend: months.map((m, i) => ({ name: m, revenue: revenueGrowth[i] })),
    tenantTrend: months.map((m, i) => ({ name: m, tenants: tenantGrowth[i] }))
  }
}
