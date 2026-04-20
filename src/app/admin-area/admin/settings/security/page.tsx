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
import { Badge } from '@/components/ui/badge'
import { Shield, Clock, User, Eye, Lock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function SecurityAuditPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const logs = await prisma.auditLog.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    take: 100,
    // We would normally include user details here, but let's keep it simple for now
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
             <Shield className="h-8 w-8 text-primary" /> Sécurité & Audit
          </h1>
          <p className="text-slate-500 mt-1">Registre des accès et actions sensibles (Conformité Loi 25).</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
           <Lock className="h-4 w-4" /> Environnement Sécurisé
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="font-bold h-16 pl-8">Horodatage</TableHead>
              <TableHead className="font-bold">Utilisateur</TableHead>
              <TableHead className="font-bold">Action</TableHead>
              <TableHead className="font-bold">Catégorie</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold">IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {logs.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                   Aucun journal d'audit enregistré.
                 </TableCell>
               </TableRow>
             ) : (
               logs.map((log) => (
                 <TableRow key={log.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                   <TableCell className="pl-8">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{format(log.createdAt, 'd MMM HH:mm:ss')}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{format(log.createdAt, 'yyyy')}</span>
                      </div>
                   </TableCell>
                   <TableCell>
                      <div className="flex items-center gap-2">
                         <User className="h-3.5 w-3.5 text-slate-400" />
                         <span className="text-sm font-medium text-slate-700">{log.userId?.substring(0,8)}...</span>
                      </div>
                   </TableCell>
                   <TableCell>
                      <Badge variant="outline" className="font-black text-[10px] bg-slate-50">
                         {log.action}
                      </Badge>
                   </TableCell>
                   <TableCell>
                      <span className="text-xs font-bold text-primary uppercase tracking-tighter">{log.category}</span>
                   </TableCell>
                   <TableCell className="max-w-[300px]">
                      <p className="text-xs text-slate-600 line-clamp-1">{log.description}</p>
                   </TableCell>
                   <TableCell>
                      <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                         {log.ipAddress || '0.0.0.0'}
                      </code>
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
