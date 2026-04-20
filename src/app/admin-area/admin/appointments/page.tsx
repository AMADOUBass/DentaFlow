import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Phone
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function AppointmentsPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const appointments = await prisma.appointment.findMany({
    where: { tenantId },
    include: {
      patient: true,
      practitioner: true,
      service: true
    },
    orderBy: { startsAt: 'desc' },
    take: 50 // Limit for the list view
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Agenda & Rendez-vous</h1>
          <p className="text-slate-500 mt-1">Gérez le flux des patients et le calendrier médical.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl font-bold bg-white gap-2">
              <Filter className="h-4 w-4" /> Filtres
           </Button>
           <Button className="h-12 px-6 rounded-xl font-bold bg-slate-900 shadow-xl shadow-slate-200">
              Nouveau RDV
           </Button>
        </div>
      </div>

      {/* Agenda Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg"><ChevronLeft className="h-5 w-5" /></Button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border font-black text-slate-800">
               <CalendarIcon className="h-4 w-4 text-primary" />
               {format(new Date(), 'MMMM yyyy', { locale: fr }).toUpperCase()}
            </div>
            <Button variant="ghost" size="icon" className="rounded-lg"><ChevronRight className="h-5 w-5" /></Button>
         </div>
         <div className="hidden md:flex items-center gap-4 border-l pl-6 ml-6">
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-amber-400"></span>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">En attente</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirmé</span>
            </div>
         </div>
      </div>

      {/* Detailed List View */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="font-bold">Horaire</TableHead>
              <TableHead className="font-bold">Patient</TableHead>
              <TableHead className="font-bold">Soin / Praticien</TableHead>
              <TableHead className="font-bold">Statut</TableHead>
              <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {appointments.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                   Aucun rendez-vous trouvé.
                 </TableCell>
               </TableRow>
             ) : (
               appointments.map((apt) => (
                 <TableRow key={apt.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors h-24">
                   <TableCell className="w-[150px]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-900 font-black">
                           <Clock className="h-3 w-3 text-primary" />
                           {format(apt.startsAt, 'HH:mm')}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                           {format(apt.startsAt, 'eeee d MMMM', { locale: fr })}
                        </p>
                      </div>
                   </TableCell>
                   <TableCell>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black border border-primary/10">
                            {apt.patient.firstName[0]}{apt.patient.lastName[0]}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 leading-none">{apt.patient.firstName} {apt.patient.lastName}</p>
                            <div className="flex items-center gap-3 mt-1.5 opacity-60">
                               <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-tighter">
                                  <Phone className="h-2.5 w-2.5" /> {apt.patient.phone}
                               </span>
                            </div>
                         </div>
                      </div>
                   </TableCell>
                   <TableCell>
                      <div className="space-y-1">
                         <p className="text-sm font-bold text-slate-800">{apt.service.name}</p>
                         <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                            <UserIcon className="h-2.5 w-2.5" /> {apt.practitioner.title} {apt.practitioner.lastName}
                         </p>
                      </div>
                   </TableCell>
                   <TableCell>
                      <Badge 
                        variant={apt.status === 'CONFIRMED' ? 'default' : 'secondary'} 
                        className={`rounded-lg font-black text-[10px] ${
                           apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' : ''
                        }`}
                      >
                        {apt.status === 'PENDING' ? 'EN ATTENTE' : apt.status}
                      </Badge>
                   </TableCell>
                   <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {apt.status === 'PENDING' && (
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-emerald-600 hover:bg-emerald-50">
                              <CheckCircle2 className="h-4 w-4" />
                           </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400 hover:text-slate-900">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                   </TableCell>
                 </TableRow>
               ))
             )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function MoreVertical({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  )
}
