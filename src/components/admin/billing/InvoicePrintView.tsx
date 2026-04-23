'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Printer, Download, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InvoicePrintProps {
  invoice: {
    id: string
    createdAt: Date
    dueDate: Date
    status: string
    subtotal: number
    taxTPS: number
    taxTVQ: number
    total: number
    patientShare: number
    insuranceShare: number
    patient: {
      firstName: string
      lastName: string
      address: string
      city: string
      postalCode: string
    }
    tenant: {
      name: string
      address: string
      city: string
      postalCode: string
      phone: string
      email: string
    }
  }
}

export function InvoicePrintView({ invoice }: InvoicePrintProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      {/* Actions (Hidden on Print) */}
      <div className="flex items-center justify-end gap-3 print:hidden">
        <Button variant="outline" className="rounded-2xl gap-2" onClick={handlePrint}>
          <Printer className="h-4 w-4" /> Imprimer / PDF
        </Button>
        <Button variant="outline" className="rounded-2xl gap-2">
          <Mail className="h-4 w-4" /> Envoyer par courriel
        </Button>
        <Button className="rounded-2xl gap-2 bg-slate-900 shadow-xl shadow-slate-200">
          <Download className="h-4 w-4" /> Télécharger
        </Button>
      </div>

      {/* Invoice Document */}
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-100 border border-slate-100 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="space-y-4">
             <div className="text-3xl font-black text-slate-900 tracking-tighter">
               {invoice.tenant.name}
             </div>
             <div className="text-sm text-slate-500 font-medium leading-relaxed">
               {invoice.tenant.address}<br />
               {invoice.tenant.city}, {invoice.tenant.postalCode}<br />
               Tél: {invoice.tenant.phone}<br />
               Email: {invoice.tenant.email}
             </div>
          </div>
          <div className="text-right">
             <h1 className="text-5xl font-black text-slate-200 uppercase tracking-tighter mb-4">Facture</h1>
             <div className="space-y-1">
               <p className="text-sm font-black text-slate-900">N° {invoice.id.toUpperCase()}</p>
               <p className="text-sm text-slate-500 font-medium">Date: {format(invoice.createdAt, 'dd MMMM yyyy', { locale: fr })}</p>
             </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-16 pb-12 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Facturé à :</p>
            <div className="text-lg font-bold text-slate-900">
               {invoice.patient.firstName} {invoice.patient.lastName}
            </div>
            <div className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
               {invoice.patient.address}<br />
               {invoice.patient.city}, {invoice.patient.postalCode}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Statut du paiement :</p>
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
              invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {invoice.status === 'PAID' ? 'Payée' : 'En attente'}
            </span>
          </div>
        </div>

        {/* Table Placeholder (Simplified for demo) */}
        <table className="w-full mb-16">
           <thead>
             <tr className="border-b-2 border-slate-900">
               <th className="text-left py-4 text-xs font-black uppercase tracking-widest">Description des soins</th>
               <th className="text-right py-4 text-xs font-black uppercase tracking-widest">Montant</th>
             </tr>
           </thead>
           <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-6 font-bold text-slate-800">Traitements dentaires (Détails au dossier)</td>
                <td className="py-6 text-right font-black text-slate-900">{(invoice.subtotal / 100).toFixed(2)}$</td>
              </tr>
           </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end">
           <div className="w-80 space-y-4">
              <div className="flex justify-between text-sm font-medium text-slate-500">
                 <span>Sous-total</span>
                 <span>{(invoice.subtotal / 100).toFixed(2)}$</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500">
                 <span>TPS (5%)</span>
                 <span>{(invoice.taxTPS / 100).toFixed(2)}$</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500 border-b border-slate-100 pb-4">
                 <span>TVQ (9.975%)</span>
                 <span>{(invoice.taxTVQ / 100).toFixed(2)}$</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 pt-2">
                 <span>Total</span>
                 <span>{(invoice.total / 100).toFixed(2)}$</span>
              </div>
              
              {/* Insurance Split */}
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl space-y-3 print:bg-slate-100">
                 <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span>Part Assurance</span>
                    <span className="text-primary">-{(invoice.insuranceShare / 100).toFixed(2)}$</span>
                 </div>
                 <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-white print:border-slate-300">
                    <span>Reste à payer Patient</span>
                    <span className="text-xl">{(invoice.patientShare / 100).toFixed(2)}$</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-center space-y-2">
           <p className="text-sm font-bold text-slate-900">Merci de votre confiance !</p>
           <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">Oros System — Document Officiel</p>
        </div>
      </div>
    </div>
  )
}
