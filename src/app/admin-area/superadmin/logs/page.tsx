import { getGlobalAuditLogsAction } from '@/server/superadmin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, ArrowLeft, Clock, Building2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

export default async function SuperAdminLogsPage() {
  const logs = await getGlobalAuditLogsAction(50)

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Link href="/admin-area/superadmin">
               <Button variant="ghost" size="icon" className="rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all">
                  <ArrowLeft className="h-5 w-5" />
               </Button>
            </Link>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-primary" /> Audit Logs Globaux
               </h1>
               <p className="text-slate-500 font-medium mt-1">Conformité Loi 25 — Traçabilité complète de la plateforme.</p>
            </div>
         </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
         <CardHeader className="bg-slate-900 text-white p-8">
            <CardTitle className="text-xl font-black flex items-center gap-2">
               <Clock className="h-5 w-5 text-primary" /> Journal d'Audit Temps Réel
            </CardTitle>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Heure</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Clinique</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Utilisateur</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Action / Ressource</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="p-6 whitespace-nowrap">
                              <p className="text-sm font-bold text-slate-900">{format(new Date(log.createdAt), 'd MMM yyyy', { locale: fr })}</p>
                              <p className="text-[10px] font-medium text-slate-400">{format(new Date(log.createdAt), 'HH:mm:ss')}</p>
                           </td>
                           <td className="p-6">
                              <div className="flex items-center gap-2">
                                 <Building2 className="h-4 w-4 text-slate-300" />
                                 <span className="text-sm font-black text-slate-700">{log.tenant.name}</span>
                              </div>
                           </td>
                           <td className="p-6">
                              <div className="flex items-center gap-2">
                                 <User className="h-4 w-4 text-slate-300" />
                                 <span className="text-sm font-bold text-slate-600">{log.user.firstName} {log.user.lastName}</span>
                              </div>
                           </td>
                           <td className="p-6">
                              <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase border-slate-200 text-slate-500 mb-1">
                                 {log.category}
                              </Badge>
                              <p className="text-sm font-medium text-slate-900">{log.description}</p>
                           </td>
                           <td className="p-6">
                              <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold">SUCCÈS</Badge>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
         <ShieldCheck className="h-6 w-6 text-amber-600 mt-1" />
         <div>
            <h4 className="font-black text-amber-900">Note de Conformité</h4>
            <p className="text-sm font-medium text-amber-700 mt-1 leading-relaxed">
               Ces logs sont immuables et horodatés. Conformément à la Loi 25, ils sont conservés pendant 5 ans et sont accessibles uniquement par le SuperAdmin de la plateforme.
            </p>
         </div>
      </div>
    </div>
  )
}
