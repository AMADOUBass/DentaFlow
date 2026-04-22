import React from 'react'
import { getAdminUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { DENTAL_FEE_GUIDE } from '@/lib/billing-codes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Tag, Info, Settings2 } from 'lucide-react'

export default async function PricingSettingsPage() {
  const user = await getAdminUser()
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Guide de Tarifs</h1>
          <p className="text-slate-500 mt-2">Gérez les codes d'actes et les prix appliqués dans votre clinique.</p>
        </div>
        <Button className="rounded-xl font-bold gap-2">
          <Settings2 className="h-4 w-4" /> Importer Guide ACDQ 2026
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Info Card */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white overflow-hidden">
              <CardHeader className="pb-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                 </div>
                 <CardTitle className="text-xl font-black">Fiscalité Québec</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Taux en vigueur</p>
                    <div className="space-y-1">
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-300">TPS</span>
                          <span className="font-black text-white">5.00%</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-slate-300">TVQ</span>
                          <span className="font-black text-white">9.975%</span>
                       </div>
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed italic">
                   Note: La plupart des actes préventifs et curatifs sont exonérés. Les taxes s'appliquent principalement aux soins esthétiques.
                 </p>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm rounded-[2.5rem] bg-primary/5 border border-primary/10">
              <CardHeader>
                 <div className="flex items-center gap-2 text-primary">
                    <Info className="h-4 w-4" />
                    <CardTitle className="text-sm font-black uppercase">Aide</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 font-medium leading-relaxed">
                 Les prix affichés ici sont les prix de base. Vous pouvez les ajuster individuellement lors de la génération d'une facture si nécessaire.
              </CardContent>
           </Card>
        </div>

        {/* Pricing Table */}
        <Card className="lg:col-span-3 border-none shadow-sm rounded-[2.5rem]">
           <CardHeader>
              <CardTitle className="text-xl font-black">Actes & Services</CardTitle>
              <CardDescription>Liste des actes configurés pour votre clinique.</CardDescription>
           </CardHeader>
           <CardContent>
              <Table>
                 <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100">
                       <TableHead className="w-[100px] font-black text-slate-400 uppercase text-[10px]">Code</TableHead>
                       <TableHead className="font-black text-slate-400 uppercase text-[10px]">Description</TableHead>
                       <TableHead className="w-[120px] font-black text-slate-400 uppercase text-[10px]">Taxable</TableHead>
                       <TableHead className="w-[120px] text-right font-black text-slate-400 uppercase text-[10px]">Prix de base</TableHead>
                       <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {DENTAL_FEE_GUIDE.map((service) => (
                       <TableRow key={service.code} className="hover:bg-slate-50 transition-colors border-slate-50 h-16">
                          <TableCell>
                             <Badge variant="outline" className="font-black border-slate-200 text-slate-500 rounded-lg">{service.code}</Badge>
                          </TableCell>
                          <TableCell className="font-bold text-slate-700">{service.description}</TableCell>
                          <TableCell>
                             {service.isTaxable ? (
                               <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold rounded-lg">OUI</Badge>
                             ) : (
                               <Badge variant="outline" className="text-slate-300 font-bold rounded-lg uppercase text-[10px]">Exonéré</Badge>
                             )}
                          </TableCell>
                          <TableCell className="text-right">
                             <span className="text-lg font-black text-slate-900">{(service.unitPrice / 100).toFixed(2)}$</span>
                          </TableCell>
                          <TableCell className="text-right">
                             <Button variant="ghost" size="sm" className="font-black text-primary">Modifier</Button>
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
