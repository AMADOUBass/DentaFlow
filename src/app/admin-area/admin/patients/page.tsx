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
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Mail, Phone, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ExportPatientButton } from './export-patient-button'

export default async function PatientsPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const patients = await prisma.patient.findMany({
    where: { tenantId },
    orderBy: { lastName: 'asc' },
    include: {
      appointments: {
        orderBy: { startsAt: 'desc' },
        take: 1
      }
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-1">Gérez votre base de données patients et leurs dossiers.</p>
        </div>
        <Button className="h-12 px-6 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20 gap-2">
          <UserPlus className="h-4 w-4" /> Nouveau Patient
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
         <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
               placeholder="Rechercher par nom, courriel ou téléphone..." 
               className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
            />
         </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="font-bold">Patient</TableHead>
              <TableHead className="font-bold">Contact</TableHead>
              <TableHead className="font-bold">Dernière Visite</TableHead>
              <TableHead className="font-bold">Inscrit le</TableHead>
              <TableHead className="text-right font-bold w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {patients.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                   Aucun patient trouvé.
                 </TableCell>
               </TableRow>
             ) : (
               patients.map((patient) => {
                 const lastAppointment = patient.appointments[0]
                 
                 return (
                   <TableRow key={patient.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                     <TableCell>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600">
                              {patient.firstName[0]}{patient.lastName[0]}
                           </div>
                           <div>
                              <p className="font-bold text-slate-900 leading-none">{patient.firstName} {patient.lastName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">ID: {patient.id.substring(0,8)}</p>
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="space-y-1">
                           <p className="text-sm font-medium flex items-center gap-2"><Phone className="h-3 w-3 text-slate-400" /> {patient.phone}</p>
                           <p className="text-xs text-slate-500 flex items-center gap-2"><Mail className="h-3 w-3 text-slate-400" /> {patient.email}</p>
                        </div>
                     </TableCell>
                     <TableCell>
                        {lastAppointment ? (
                           <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                              <Calendar className="h-3 w-3" />
                              {format(lastAppointment.startsAt, 'd MMMM yyyy', { locale: fr })}
                           </div>
                        ) : (
                           <span className="text-xs text-slate-400 italic">Aucune visite</span>
                        )}
                     </TableCell>
                     <TableCell>
                        <p className="text-sm text-slate-500">
                           {format(patient.createdAt, 'd MMM yyyy', { locale: fr })}
                        </p>
                     </TableCell>
                      <TableCell className="text-right">
                         <div className="flex justify-end gap-2">
                           <ExportPatientButton 
                              tenantId={tenantId} 
                              patientId={patient.id} 
                              patientName={`${patient.firstName} ${patient.lastName}`} 
                           />
                           <Button variant="ghost" size="sm" className="font-bold text-primary">Dossier</Button>
                         </div>
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
