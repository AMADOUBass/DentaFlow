import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format, isAfter, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, Clock, User as UserIcon, AlertCircle } from 'lucide-react'
import { CancelAppointmentButton } from './cancel-button'
import { getTenantPath } from '@/lib/tenant'

interface AppointmentsPageProps {
  params: Promise<{ tenant: string }>
}

export default async function PatientAppointmentsPage({ params }: AppointmentsPageProps) {
  const { tenant: tenantSlug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) redirect(await getTenantPath('/login/patient'))

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
  if (!tenant) redirect('/')

  const patient = await prisma.patient.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email: user.email } },
    include: {
      appointments: {
        include: {
          practitioner: true,
          service: true
        },
        orderBy: { startsAt: 'desc' }
      }
    }
  })

  if (!patient) redirect('/')

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes Rendez-vous</h1>
        <p className="text-slate-500 mt-2">Consultez et gérez l'ensemble de vos soins programmés.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
        <Table className="min-w-[700px]">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="font-bold text-slate-800 h-16 pl-8">Date & Heure</TableHead>
              <TableHead className="font-bold text-slate-800">Soin</TableHead>
              <TableHead className="font-bold text-slate-800">Praticien</TableHead>
              <TableHead className="font-bold text-slate-800">Statut</TableHead>
              <TableHead className="text-right font-bold text-slate-800 pr-8">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patient.appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                  Aucun rendez-vous trouvé.
                </TableCell>
              </TableRow>
            ) : (
              patient.appointments.map((apt) => {
                const isUpcoming = isAfter(apt.startsAt, new Date())
                const canCancel = isAfter(apt.startsAt, addDays(new Date(), 1)) && apt.status === 'PENDING' || apt.status === 'CONFIRMED'
                
                return (
                  <TableRow key={apt.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors h-24">
                    <TableCell className="pl-8">
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{format(apt.startsAt, 'd MMMM yyyy', { locale: fr })}</span>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                             <Clock className="h-3 w-3" /> {format(apt.startsAt, 'HH:mm')}
                          </span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <p className="font-bold text-slate-700">{apt.service.name}</p>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                             {apt.practitioner.lastName[0]}
                          </div>
                          <span className="text-sm font-medium text-slate-600">
                             {apt.practitioner.title} {apt.practitioner.lastName}
                          </span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge 
                         variant={apt.status === 'CANCELLED' ? 'destructive' : 'default'}
                         className={`rounded-xl font-bold px-3 ${
                            apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            apt.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700 border-rose-200' : ''
                         }`}
                       >
                         {apt.status === 'PENDING' ? 'EN ATTENTE' : apt.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       {isUpcoming && apt.status !== 'CANCELLED' ? (
                          <>
                             {canCancel ? (
                               <CancelAppointmentButton appointmentId={apt.id} />
                             ) : (
                               <Badge variant="outline" className="text-[10px] font-black tracking-tighter opacity-50 border-amber-200 text-amber-700 py-1.5">
                                  NON ANNULABLE (-24h)
                               </Badge>
                             )}
                          </>
                       ) : (
                          <span className="text-xs text-slate-300 italic font-bold">Historique</span>
                       )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
