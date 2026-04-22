'use server'

import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format,
  subMonths,
  startOfToday
} from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Récupère les données de revenus agrégées (CA global, par praticien, par catégorie)
 */
export async function getRevenueAnalytics(period: 'week' | 'month' | 'year' = 'month') {
  const user = await getAdminUser()
  const tenantId = user.tenantId!
  const now = new Date()

  let startDate: Date
  let endDate: Date = now

  if (period === 'week') {
    startDate = startOfWeek(now, { weekStartsOn: 1 })
    endDate = endOfWeek(now, { weekStartsOn: 1 })
  } else if (period === 'month') {
    startDate = startOfMonth(now)
    endDate = endOfMonth(now)
  } else {
    startDate = startOfMonth(subMonths(now, 11)) // 12 derniers mois
  }

  // 1. CA Global et par Praticien
  const invoices = await (prisma as any).invoice.findMany({
    where: {
      tenantId,
      createdAt: { gte: startDate, lte: endDate },
      status: { in: ['ISSUED', 'PAID'] }
    },
    include: {
      practitioner: true,
      items: true
    }
  })

  // Agrégation par praticien
  const practitionerStats: Record<string, { name: string; value: number }> = {}
  let totalRevenue = 0

  invoices.forEach((inv: any) => {
    totalRevenue += inv.totalAmount
    const pName = inv.practitioner ? `${inv.practitioner.firstName} ${inv.practitioner.lastName}` : 'Non assigné'
    const pId = inv.practitionerId || 'unassigned'
    
    if (!practitionerStats[pId]) {
      practitionerStats[pId] = { name: pName, value: 0 }
    }
    practitionerStats[pId].value += inv.totalAmount
  })

  // Agrégation par tendance temporelle (ex: par jour pour la semaine/mois)
  const timeSeries: Record<string, number> = {}
  if (period !== 'year') {
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    days.forEach(day => {
      timeSeries[format(day, 'yyyy-MM-dd')] = 0
    })

    invoices.forEach((inv: any) => {
      const dayKey = format(new Date(inv.createdAt), 'yyyy-MM-dd')
      if (timeSeries[dayKey] !== undefined) {
        timeSeries[dayKey] += inv.totalAmount
      }
    })
  }

  return {
    totalRevenue,
    practitionerData: Object.values(practitionerStats),
    trendData: Object.entries(timeSeries).map(([date, value]) => ({ 
      date: format(new Date(date), period === 'week' ? 'EEE' : 'd MMM', { locale: fr }), 
      revenue: value 
    })),
    count: invoices.length
  }
}

/**
 * Récupère les métriques opérationnelles (RDV, occupation, no-shows)
 */
export async function getOperationalMetrics() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!
  const today = startOfToday()

  const [totalAppointments, completedCount, cancelledCount, noShowCount] = await Promise.all([
    prisma.appointment.count({ where: { tenantId, startsAt: { gte: startOfMonth(today) } } }),
    prisma.appointment.count({ where: { tenantId, status: 'COMPLETED', startsAt: { gte: startOfMonth(today) } } }),
    prisma.appointment.count({ where: { tenantId, status: 'CANCELLED', startsAt: { gte: startOfMonth(today) } } }),
    prisma.appointment.count({ where: { tenantId, status: 'NO_SHOW', startsAt: { gte: startOfMonth(today) } } })
  ])

  const completionRate = totalAppointments > 0 ? (completedCount / totalAppointments) * 100 : 0
  const noShowRate = totalAppointments > 0 ? (noShowCount / totalAppointments) * 100 : 0

  return {
    totalAppointments,
    completionRate,
    noShowRate,
    stats: [
      { name: 'Complétés', value: completedCount, color: '#10b981' },
      { name: 'Annulés', value: cancelledCount, color: '#f59e0b' },
      { name: 'No-Shows', value: noShowCount, color: '#ef4444' }
    ]
  }
}

/**
 * Synthèse Audit Loi 25
 */
export async function getAuditSummary() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const [recentLogs, sensitiveAccessCount] = await Promise.all([
    (prisma as any).auditLog.findMany({
      where: { 
        tenantId,
        category: { in: ['PATIENT_DATA', 'MEDICAL_RECORDS'] }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    }),
    (prisma as any).auditLog.count({
      where: {
        tenantId,
        createdAt: { gte: subMonths(new Date(), 1) },
        category: { in: ['PATIENT_DATA', 'MEDICAL_RECORDS'] }
      }
    })
  ])

  return {
    recentLogs,
    sensitiveAccessCount,
    status: sensitiveAccessCount > 500 ? 'Attention' : 'Normal'
  }
}
