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
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { AlertCircle, CheckCircle2, Phone, Mail, Clock } from 'lucide-react'
import { toggleEmergencyHandled } from '@/server/emergencies'

export default async function EmergenciesPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const emergencies = await prisma.emergencyRequest.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Demandes d'Urgence</h1>
          <p className="text-slate-500 mt-1">Gérez les situations critiques et le tri des patients.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="font-bold">Patient</TableHead>
              <TableHead className="font-bold">Contact</TableHead>
              <TableHead className="font-bold">Urgence & Douleur</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {emergencies.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                   Aucune demande d'urgence enregistrée.
                 </TableCell>
               </TableRow>
             ) : (
               emergencies.map((err) => (
                 <TableRow key={err.id} className={`border-slate-50 transition-colors ${err.handled ? 'opacity-60 grayscale-[0.5]' : 'bg-rose-50/20'}`}>
                   <TableCell className="font-bold text-slate-900">
                     {err.firstName} {err.lastName}
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                        Reçu {format(err.createdAt, 'd MMM HH:mm', { locale: fr })}
                     </p>
                   </TableCell>
                   <TableCell>
                      <div className="space-y-1">
                         <p className="text-sm font-bold flex items-center gap-2"><Phone className="h-3 w-3" /> {err.phone}</p>
                         {err.email && <p className="text-xs text-slate-500 flex items-center gap-2"><Mail className="h-3 w-3" /> {err.email}</p>}
                      </div>
                   </TableCell>
                   <TableCell>
                      <div className="flex flex-col gap-2">
                        <Badge 
                           variant="outline" 
                           className={`w-fit font-black border-2 ${
                              err.painLevel >= 8 ? 'bg-rose-100 border-rose-200 text-rose-700' : 
                              err.painLevel >= 5 ? 'bg-amber-100 border-amber-200 text-amber-700' : 
                              'bg-sky-100 border-sky-200 text-sky-700'
                           }`}
                        >
                           Douleur {err.painLevel}/10
                        </Badge>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{err.category}</span>
                      </div>
                   </TableCell>
                   <TableCell className="max-w-[300px]">
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{err.description}</p>
                   </TableCell>
                   <TableCell className="text-center">
                      {err.handled ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold rounded-lg px-3">
                           TRAITÉ
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500 text-white font-bold rounded-lg px-3 animate-pulse">
                           EN ATTENTE
                        </Badge>
                      )}
                   </TableCell>
                   <TableCell className="text-right">
                      <form action={toggleEmergencyHandled.bind(null, err.id)}>
                        <Button 
                           type="submit"
                           variant={err.handled ? 'outline' : 'default'} 
                           size="sm" 
                           className={`rounded-xl font-bold gap-2 ${!err.handled ? 'bg-slate-900' : ''}`}
                        >
                           {err.handled ? 'Réouvrir' : 'Marquer traité'}
                        </Button>
                      </form>
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
