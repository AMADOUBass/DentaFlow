import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Sparkles,
  Plus,
  Settings
} from 'lucide-react'
import { getAdminUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { startOfMonth, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { GreetingHeader } from '@/components/admin/GreetingHeader'
import { AnimatedItem } from '@/components/admin/AnimatedDashboardGrid'

export default async function AdminDashboardPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!
  const firstName = user.name.split(' ')[0]

  // 1. Data Fetching
  const [
    totalPatients,
    appointmentsCount,
    pendingEmergenciesCount,
    nextAppointments,
    recentEmergencies
  ] = await Promise.all([
    prisma.patient.count({ where: { tenantId } }),
    prisma.appointment.count({ 
      where: { 
        tenantId,
        startsAt: { gte: startOfMonth(new Date()) } 
      } 
    }),
    prisma.emergencyRequest.count({ where: { tenantId, handled: false } }),
    prisma.appointment.findMany({
      where: { 
        tenantId,
        startsAt: { gte: new Date() }
      },
      include: {
        patient: true,
        practitioner: true,
        service: true
      },
      orderBy: { startsAt: 'asc' },
      take: 5
    }),
    prisma.emergencyRequest.findMany({
      where: { tenantId, handled: false },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  return (
    <div className="space-y-8">
      {/* Header with Visual Alert */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <GreetingHeader userName={firstName} />
        
        <div className="flex items-center gap-4">
          {pendingEmergenciesCount > 0 && (
            <Link href="/admin-area/admin/emergencies" className="animate-pulse">
               <Badge variant="destructive" className="h-10 px-4 rounded-xl gap-2 text-sm font-black shadow-lg shadow-rose-200">
                  <AlertCircle className="h-4 w-4" />
                  {pendingEmergenciesCount} Urgence{pendingEmergenciesCount > 1 ? 's' : ''} à traiter
               </Badge>
            </Link>
          )}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border text-sm font-medium text-slate-600">
            <CalendarCheck className="h-4 w-4 text-primary" />
            {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedItem delay={0.1}>
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-white border border-slate-100">
            <CardContent className="p-7">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  <ArrowUpRight className="h-3 w-3" /> +12%
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Patients</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{totalPatients}</h3>
              </div>
            </CardContent>
          </Card>
        </AnimatedItem>

        <AnimatedItem delay={0.2}>
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 bg-white border border-slate-100">
            <CardContent className="p-7">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-sky-100 rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                  <CalendarCheck className="h-6 w-6 text-sky-600 group-hover:text-white" />
                </div>
                <div className="flex items-center gap-1 text-sky-600 bg-sky-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  Stable
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">RDV ce mois</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{appointmentsCount}</h3>
              </div>
            </CardContent>
          </Card>
        </AnimatedItem>

        <AnimatedItem delay={0.3}>
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 bg-white border border-slate-100">
            <CardContent className="p-7">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-100 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <TrendingUp className="h-6 w-6 text-emerald-600 group-hover:text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  Excellent
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Taux Rétention</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">94%</h3>
              </div>
            </CardContent>
          </Card>
        </AnimatedItem>

        <AnimatedItem delay={0.4}>
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 bg-white border border-slate-100">
            <CardContent className="p-7">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-rose-100 rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                  <AlertCircle className="h-6 w-6 text-rose-600 group-hover:text-white" />
                </div>
                {pendingEmergenciesCount > 0 && (
                  <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Priorité
                  </div>
                )}
              </div>
              <div className="mt-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Urgences</p>
                <h3 className="text-3xl font-black text-rose-600 mt-1">{pendingEmergenciesCount}</h3>
              </div>
            </CardContent>
          </Card>
        </AnimatedItem>
      </div>

      {/* Quick Actions Panel */}
      <AnimatedItem delay={0.5}>
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                 <h2 className="text-2xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
                    <Sparkles className="h-6 w-6 text-primary" /> Actions Rapides
                 </h2>
                 <p className="text-slate-400 font-medium">Simplifiez votre gestion quotidienne en un clic.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
                 <Link href="/admin-area/admin/appointments">
                    <Button className="w-full h-16 bg-white/10 hover:bg-white/20 border-white/10 rounded-2xl flex flex-col gap-1 transition-all group">
                       <CalendarCheck className="h-5 w-5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Nouveau RDV</span>
                    </Button>
                 </Link>
                 <Link href="/admin-area/admin/patients">
                    <Button className="w-full h-16 bg-white/10 hover:bg-white/20 border-white/10 rounded-2xl flex flex-col gap-1 transition-all group">
                       <Plus className="h-5 w-5 text-sky-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Patient</span>
                    </Button>
                 </Link>
                 <Link href="/admin-area/admin/practitioners">
                    <Button className="w-full h-16 bg-white/10 hover:bg-white/20 border-white/10 rounded-2xl flex flex-col gap-1 transition-all group">
                       <Stethoscope className="h-5 w-5 text-emerald-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Équipe</span>
                    </Button>
                 </Link>
                 <Link href="/admin-area/admin/settings">
                    <Button className="w-full h-16 bg-white/10 hover:bg-white/20 border-white/10 rounded-2xl flex flex-col gap-1 transition-all group">
                       <Settings className="h-5 w-5 text-amber-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Config</span>
                    </Button>
                 </Link>
              </div>
           </div>
        </div>
      </AnimatedItem>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Next Appointments */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Prochains Rendez-vous</CardTitle>
            <Link href="/admin-area/admin/appointments">
               <Button variant="ghost" size="sm" className="text-primary font-bold">Voir tout <ChevronRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {nextAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic">Aucun rendez-vous prévu.</div>
            ) : (
              <div className="space-y-4">
                {nextAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {apt.patient.firstName[0]}{apt.patient.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{apt.patient.firstName} {apt.patient.lastName}</p>
                        <p className="text-xs text-slate-500">{apt.service.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-slate-700">{format(apt.startsAt, 'HH:mm')}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">{format(apt.startsAt, 'd MMM')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Emergencies */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Urgences à traiter</CardTitle>
            <Link href="/admin-area/admin/emergencies">
               <Button variant="ghost" size="sm" className="text-rose-600 font-bold">Gérer</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentEmergencies.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic">Tout est sous contrôle ! Aucune urgence.</div>
            ) : (
              <div className="space-y-4">
                {recentEmergencies.map((err) => (
                  <div key={err.id} className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-rose-200 flex items-center justify-center text-rose-600 shadow-sm shadow-rose-200">
                       <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <p className="text-sm font-black text-rose-900">{err.firstName} {err.lastName}</p>
                          <Badge variant="outline" className="text-[10px] bg-white border-rose-200 text-rose-600">Niv. {err.painLevel}</Badge>
                       </div>
                       <p className="text-xs text-rose-700 font-medium line-clamp-1 mt-1">{err.description}</p>
                       <p className="text-[10px] text-rose-400 mt-2 font-bold uppercase">{format(err.createdAt, 'HH:mm', { locale: fr })} — {err.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
