'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Receipt, Download, CreditCard, ExternalLink } from 'lucide-react'

export function PatientInvoiceList({ invoices = [] }: { invoices: any[] }) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-300">
        <Receipt className="h-12 w-12 mb-4" />
        <p className="font-bold">Aucune facture enregistrée pour ce patient.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Date</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Facture #</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400">Statut</TableHead>
            <TableHead className="font-black text-[10px] uppercase text-slate-400 text-right">Montant</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-slate-50 transition-colors border-slate-50">
              <TableCell className="font-bold text-slate-600">
                {format(new Date(invoice.createdAt), 'd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell className="font-black text-slate-400 uppercase text-xs">
                {invoice.id.slice(-6)}
              </TableCell>
              <TableCell>
                <InvoiceStatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="text-right font-black text-slate-900 text-lg">
                {(invoice.totalAmount / 100).toFixed(2)}$
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                   <a 
                     href={`/api/billing/invoice/${invoice.id}/pdf`} 
                     target="_blank" 
                     rel="noreferrer"
                   >
                     <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5 rounded-xl">
                        <Download className="h-4 w-4" />
                     </Button>
                   </a>
                   {invoice.status !== 'PAID' && (
                     <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-50 rounded-xl">
                        <CreditCard className="h-4 w-4" />
                     </Button>
                   )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function InvoiceStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PAID':
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold rounded-lg px-3 uppercase text-[10px]">Payée</Badge>
    case 'DRAFT':
      return <Badge variant="outline" className="text-slate-400 border-slate-200 font-bold rounded-lg px-3 uppercase text-[10px]">Brouillon</Badge>
    case 'OVERDUE':
      return <Badge className="bg-rose-100 text-rose-700 border-rose-200 font-bold rounded-lg px-3 uppercase text-[10px]">En retard</Badge>
    default:
      return <Badge className="bg-sky-100 text-sky-700 border-sky-200 font-bold rounded-lg px-3 uppercase text-[10px]">Émise</Badge>
  }
}
