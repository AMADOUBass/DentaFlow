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
import { Shield, Clock, User, Eye, Lock, ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function SecurityAuditPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  // On récupère les logs sans try/catch pour diagnostiquer l'erreur si elle existe
  const logs = await prisma.auditLog.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin-area/admin/settings" 
          className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-primary/20 transition-all shadow-sm">
            <ChevronLeft className="h-5 w-5" />
          </div>
          Retour aux réglages
        </Link>

        <div className="flex justify-between items-end">
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
                      <Badge 
                        variant="outline" 
                        className={`font-black text-[10px] uppercase tracking-widest ${
                          log.action === 'DELETE' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          log.action === 'UPDATE' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                        }`}
                      >
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
