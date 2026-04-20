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
import { Plus, MoreVertical, Edit2, Trash2, User } from 'lucide-react'
import Image from 'next/image'
import { AddPractitionerButton } from './add-practitioner-button'

export default async function PractitionersPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const practitioners = await prisma.practitioner.findMany({
    where: { tenantId },
    orderBy: { lastName: 'asc' }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Praticiens</h1>
          <p className="text-slate-500 mt-1">Gérez votre équipe médicale et leurs spécialités.</p>
        </div>
        <AddPractitionerButton />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="w-[80px] font-bold">Photo</TableHead>
              <TableHead className="font-bold">Nom Complet</TableHead>
              <TableHead className="font-bold">Titre / Spécialité</TableHead>
              <TableHead className="font-bold">Statut</TableHead>
              <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {practitioners.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                   Aucun praticien configuré.
                 </TableCell>
               </TableRow>
             ) : (
               practitioners.map((practitioner) => (
                 <TableRow key={practitioner.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                   <TableCell>
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border">
                         {practitioner.photoUrl ? (
                           <Image 
                              src={practitioner.photoUrl} 
                              alt={practitioner.lastName} 
                              width={48} 
                              height={48} 
                              className="object-cover w-full h-full"
                           />
                         ) : (
                           <User className="h-5 w-5 text-slate-400" />
                         )}
                      </div>
                   </TableCell>
                   <TableCell className="font-bold text-slate-900">
                     {practitioner.title} {practitioner.firstName} {practitioner.lastName}
                   </TableCell>
                   <TableCell>
                     <p className="text-sm font-medium text-slate-700">{practitioner.specialty || 'Dentiste'}</p>
                   </TableCell>
                   <TableCell>
                      <Badge variant={practitioner.active ? 'default' : 'secondary'} className="rounded-lg font-bold">
                        {practitioner.active ? 'ACTIF' : 'INACTIF'}
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
