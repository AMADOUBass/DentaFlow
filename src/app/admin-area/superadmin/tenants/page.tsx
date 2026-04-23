import { Metadata } from 'next'
import { getTenantsAction } from '@/server/superadmin'
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  ShieldX,
  Clock,
  MoreVertical,
  Globe
} from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TenantStatusToggle } from '@/components/superadmin/TenantStatusToggle'
import { REQVerifier } from '@/components/superadmin/REQVerifier'

export const metadata: Metadata = {
  title: 'Gestion des Cliniques | SuperAdmin',
  description: 'Validation et monitoring des tenants DentaFlow.',
}

export default async function SuperAdminTenants() {
  const tenants = await getTenantsAction()

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestion des <span className="text-primary italic">Cliniques</span></h1>
          <p className="text-slate-500 font-medium tracking-tight">Périmètre : {tenants.length} centres dentaires enregistrés.</p>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-slate-100 hover:bg-slate-50">
                <TableHead className="w-[300px] font-black uppercase text-[10px] tracking-widest text-slate-500 py-6 pl-8">Clinique</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Statut</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">NEQ / Vérification</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Abonnement</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary text-xl">
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{tenant.name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Globe className="h-3 w-3" /> {tenant.slug}.oros.ca
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge className={`w-fit uppercase text-[9px] font-black tracking-widest border-none px-3 py-1 ${tenant.isValidated ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {tenant.isValidated ? 'Vérifié' : 'En attente'}
                      </Badge>
                      <Badge className={`w-fit uppercase text-[9px] font-black tracking-widest border-none px-3 py-1 ${tenant.isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                        {tenant.isActive ? 'Actif' : 'Suspendu'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <REQVerifier neq={tenant.neq} />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">{tenant.planTier}</p>
                      <p className="text-xs text-slate-500 font-medium">{tenant._count.patients} patients • {tenant._count.users} utilisateurs</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                     <TenantStatusToggle 
                        tenantId={tenant.id} 
                        initialValidated={tenant.isValidated}
                        initialActive={tenant.isActive}
                     />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
