import { Suspense } from 'react'
import { 
  getRevenueAnalytics, 
  getOperationalMetrics, 
  getAuditSummary 
} from '@/server/actions/analytics'
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header (Renders instantly) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" /> Intelligence d'Affaires
           </h1>
           <p className="text-slate-500 font-medium mt-1">Analyse approfondie de la performance clinique et financière.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl font-bold gap-2 bg-white border-slate-200 shadow-sm">
             <RefreshCcw className="h-4 w-4" /> Actualiser
           </Button>
           <Button className="rounded-2xl font-black gap-2 shadow-lg shadow-primary/20">
             Exporter PDF
           </Button>
        </div>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsDataLoader />
      </Suspense>
    </div>
  )
}

/**
 * Data loader component that fetches data and renders the dashboard.
 * Wrapped in Suspense to show skeletons during fetch.
 */
async function AnalyticsDataLoader() {
  const [revenueData, operationalMetrics, auditSummary] = await Promise.all([
    getRevenueAnalytics('month'),
    getOperationalMetrics(),
    getAuditSummary()
  ])

  return (
    <div className="space-y-8">
      <AnalyticsDashboard 
        revenueData={revenueData as any}
        operationalMetrics={operationalMetrics as any}
        auditSummary={auditSummary as any}
      />

      <div className="bg-primary/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-primary/10">
         <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <TrendingUp className="h-8 w-8" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Conseil IA : Optimisation de l'agenda</h4>
            <p className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">
              Votre taux de No-Show est de {operationalMetrics.noShowRate.toFixed(1)}%. 
              L'activation des rappels SMS automatisés pourrait réduire ce chiffre de 40% supplémentaires, augmentant votre CA prévisionnel de {(revenueData.totalRevenue * 0.05 / 100).toFixed(2)}$ par mois.
            </p>
         </div>
      </div>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[450px] rounded-[2.5rem]" />
        <Skeleton className="h-[450px] rounded-[2.5rem]" />
      </div>
    </div>
  )
}
