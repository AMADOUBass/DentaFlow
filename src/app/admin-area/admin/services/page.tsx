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
import { Plus, Edit2, Trash2, Clock, DollarSign, Tag } from 'lucide-react'
import { AddServiceButton } from './add-service-button'

export default async function ServicesPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const services = await prisma.service.findMany({
    where: { tenantId },
    orderBy: { order: 'asc' }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Services & Soins</h1>
          <p className="text-slate-500 mt-1">Configurez le catalogue des soins et leurs paramètres.</p>
        </div>
        <AddServiceButton />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="font-bold">Soin</TableHead>
              <TableHead className="font-bold">Catégorie</TableHead>
              <TableHead className="font-bold">Durée</TableHead>
              <TableHead className="font-bold">Prix (est.)</TableHead>
              <TableHead className="font-bold">Statut</TableHead>
              <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {services.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                   Aucun service configuré.
                 </TableCell>
               </TableRow>
             ) : (
               services.map((service) => (
                 <TableRow key={service.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                   <TableCell>
                      <div>
                        <p className="font-bold text-slate-900">{service.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black truncate max-w-[200px]">ID: {service.id.substring(0,8)}</p>
                      </div>
                   </TableCell>
                   <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Tag className="h-3 w-3 opacity-40" />
                        <span className="text-xs font-bold uppercase tracking-wider">{service.category}</span>
                      </div>
                   </TableCell>
                   <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="font-bold">{service.durationMin} min</span>
                      </div>
                   </TableCell>
                   <TableCell>
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <DollarSign className="h-3 w-3" />
                        {service.priceCents ? (service.priceCents / 100).toFixed(2) : '--'}
                      </div>
                   </TableCell>
                   <TableCell>
                      <Badge variant={service.active ? 'default' : 'secondary'} className="rounded-lg font-bold">
                        {service.active ? 'ACTIF' : 'INACTIF'}
                      </Badge>
                   </TableCell>
                   <TableCell className="text-right">
                     <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-500 hover:text-primary">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-500 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
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
