import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  AlertCircle,
  Stethoscope,
  ChevronRight
} from 'lucide-react'
import { getAdminUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { startOfMonth, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header with Visual Alert */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Bonjour {user.name}, voici l'état de votre clinique.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {pendingEmergenciesCount > 0 && (
            <Link href="/admin/emergencies" className="animate-pulse">
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
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Patients</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalPatients}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-sky-100 rounded-xl group-hover:bg-sky-200 transition-colors">
                <CalendarCheck className="h-5 w-5 text-sky-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">RDV ce mois</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{appointmentsCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Taux de rétention</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">94%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-rose-100 rounded-xl group-hover:bg-rose-200 transition-colors">
                <Clock className="h-5 w-5 text-rose-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Urgences en attente</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">{pendingEmergenciesCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Next Appointments */}
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Prochains Rendez-vous</CardTitle>
            <Link href="/admin/appointments">
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
            <Link href="/admin/emergencies">
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
