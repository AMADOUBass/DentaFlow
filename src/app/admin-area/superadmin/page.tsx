import { Metadata } from 'next'
import { Suspense } from 'react'
import { getPlatformStatsAction, getGrowthStatsAction } from '@/server/superadmin'
import { 
  Building2, 
  Users, 
  DollarSign, 
  CheckCircle, 
  ShieldAlert,
  Activity,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AnimatedDashboardGrid, AnimatedItem } from '@/components/admin/AnimatedDashboardGrid'
import { Button } from '@/components/ui/button'
import { logout } from '@/server/auth'
import { SuperAdminCharts } from '@/components/admin/superadmin/SuperAdminCharts'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SuperAdmin | DentaFlow Platform',
  description: 'Gestion globale de la plateforme DentaFlow.',
}

export default async function SuperAdminDashboard() {
  const stats = await getPlatformStatsAction()

  const cards = [
    {
      title: "Total Cliniques",
      value: stats.totalTenants,
      description: "Inscriptions depuis le lancement",
      icon: <Building2 className="h-6 w-6 text-primary" />,
    },
    {
      title: "Utilisateurs Actifs",
      value: stats.totalUsers,
      description: "Personnel et praticiens",
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Revenus (Est.)",
      value: `${(stats.estimatedRevenue / 100).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`,
      description: "SaaS & Commissions",
      icon: <DollarSign className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: "Status Système",
      value: "Stable",
      description: "Temps de réponse 44ms",
      icon: <Activity className="h-6 w-6 text-cyan-500" />,
    },
  ]

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-7xl mx-auto">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
              Root Console
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            DentaFlow <span className="text-slate-400">/</span> SuperAdmin
          </h1>
          <p className="text-slate-500 font-medium">Contrôle global et intelligence d'affaires (BI).</p>
        </div>

        <div className="flex items-center gap-3">
           <form action={logout}>
              <Button variant="outline" className="rounded-2xl h-12 border-slate-200 font-bold gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">
                <LogOut className="h-4 w-4" /> Déconnexion
              </Button>
           </form>
           <Button className="rounded-2xl h-12 bg-slate-900 hover:bg-slate-800 font-bold gap-2 shadow-xl shadow-slate-200">
             <ShieldCheck className="h-4 w-4" /> Paramètres Globaux
           </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <AnimatedDashboardGrid>
        {cards.map((card, i) => (
          <AnimatedItem key={card.title}>
            <Card className="border-none shadow-xl shadow-slate-100 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">{card.title}</CardTitle>
                <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-white transition-colors">
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</div>
                <p className="text-xs text-slate-500 mt-2 font-bold flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </AnimatedItem>
        ))}
      </AnimatedDashboardGrid>

      {/* BI Analytics Section with Suspense */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <TrendingUp className="h-6 w-6 text-primary" /> Croissance & Performance
           </h2>
           <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5">
             Exporter le rapport (PDF)
           </Button>
        </div>
        
        <Suspense fallback={<ChartsSkeleton />}>
          <ChartsDataWrapper />
        </Suspense>
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl shadow-slate-100 rounded-[2.5rem] p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Gestion des Cliniques</h3>
            <p className="text-sm text-slate-500 font-medium">Validez les nouveaux comptes et gérez les abonnements.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin-area/superadmin/tenants?filter=pending" className="w-full">
              <Button variant="outline" className="h-20 w-full rounded-[1.5rem] border-slate-100 font-bold flex flex-col gap-1 items-start px-6 hover:border-primary/20 hover:bg-primary/5 transition-all">
                <span className="text-primary flex items-center gap-2"><CheckCircle className="h-4 w-4" /> 12 Attentes</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Validation REQ</span>
              </Button>
            </Link>
            <Link href="/admin-area/superadmin/tenants?filter=alerts" className="w-full">
              <Button variant="outline" className="h-20 w-full rounded-[1.5rem] border-slate-100 font-bold flex flex-col gap-1 items-start px-6 hover:border-rose-100 hover:bg-rose-50 transition-all">
                <span className="text-rose-600 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> 2 Alertes</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Paiements échoués</span>
              </Button>
            </Link>
          </div>
          <Button asChild className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 font-black text-lg gap-3">
             <Link href="/admin-area/superadmin/tenants">Ouvrir le Gestionnaire de Tenants</Link>
          </Button>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-slate-900 p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
               <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Journal d'Audit Global</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Consultez tous les accès aux données sensibles pour la conformité Loi 25 à travers tout le réseau DentaFlow.
            </p>
          </div>

          <Button asChild className="w-full h-14 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-lg gap-3 relative z-10">
             <Link href="/admin-area/superadmin/logs">Consulter les Logs d'Audit</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}

async function ChartsDataWrapper() {
  const growthData = await getGrowthStatsAction()
  return <SuperAdminCharts growthData={growthData} />
}

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-[400px] rounded-[2.5rem]" />
      <Skeleton className="h-[400px] rounded-[2.5rem]" />
    </div>
  )
}
