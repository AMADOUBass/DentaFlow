'use client'

import { useState } from 'react'
import { DENTAL_FEE_GUIDE, DentalService } from '@/lib/billing-codes'
import { createInvoice } from '@/server/actions/billing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Receipt, Calculator, ChevronRight, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function InvoiceGenerator({ 
  patientId, 
  appointmentId, 
  insuranceCoveragePercent = 0 
}: { 
  patientId: string, 
  appointmentId?: string,
  insuranceCoveragePercent?: number
}) {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const addItem = (service: DentalService) => {
    setSelectedItems([...selectedItems, { ...service, quantity: 1 }])
  }

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const subtotal = selectedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  const taxes = selectedItems.reduce((sum, item) => {
    if (item.isTaxable) {
      return sum + Math.round(item.unitPrice * item.quantity * 0.14975)
    }
    return sum
  }, 0)
  const total = subtotal + taxes
  
  // Logic for insurance/patient split
  const insuranceShare = Math.round(subtotal * (insuranceCoveragePercent / 100))
  const patientShare = total - insuranceShare

  const handleCreate = async () => {
    if (selectedItems.length === 0) return
    setIsSubmitting(true)
    try {
      await createInvoice({
        patientId,
        practitionerId: 'any', 
        items: selectedItems.map(item => ({
          description: item.description,
          actCode: item.code,
          amount: item.unitPrice,
          quantity: item.quantity,
          isTaxable: item.isTaxable
        })),
        insuranceCoveragePercent
      })
      toast.success('Facture générée avec succès')
      setSelectedItems([])
      router.refresh()
    } catch (error) {
      toast.error('Erreur lors de la génération de la facture')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search/Selection Area */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Plus className="h-6 w-6" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 leading-none">Sélectionner des Actes</h3>
                <p className="text-sm font-medium text-slate-400 mt-1">Cliquez pour ajouter à la facture</p>
             </div>
          </div>

          <div className="space-y-3">
             {DENTAL_FEE_GUIDE.map(item => (
               <button
                 key={item.code}
                 onClick={() => addItem(item)}
                 className="w-full p-4 rounded-2xl border border-slate-50 hover:border-primary/30 hover:bg-primary/5 transition-all flex justify-between items-center group"
               >
                  <div className="text-left">
                     <p className="text-xs font-black text-primary uppercase">{item.code}</p>
                     <p className="font-bold text-slate-700 group-hover:text-slate-900">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="font-black text-slate-900">{(item.unitPrice / 100).toFixed(2)}$</span>
                     <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Summary / Preview Area */}
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[500px]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
           
           <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-3">
                 <Receipt className="h-6 w-6 text-primary" />
                 <h3 className="text-2xl font-black italic">Nouvelle Facture</h3>
              </div>
              <Badge className="bg-primary text-slate-900 border-none font-black px-4 py-1">BROUILLON</Badge>
           </div>

           {/* Items List */}
           <div className="flex-1 space-y-4 mb-8 relative z-10 custom-scrollbar overflow-y-auto">
              {selectedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 border-2 border-dashed border-slate-800 rounded-3xl p-8">
                   <Calculator className="h-12 w-12 mb-4" />
                   <p className="font-bold">Aucun acte sélectionné</p>
                </div>
              ) : (
                selectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                     <div className="flex-1">
                        <p className="font-bold text-sm text-slate-200">{item.description}</p>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.code} {item.isTaxable && "• TAXABLE"}</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <p className="font-black">{(item.unitPrice / 100).toFixed(2)}$</p>
                        <button 
                          onClick={() => removeItem(index)}
                          className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>
                  </div>
                ))
              )}
           </div>

           {/* Totals Section */}
           <div className="pt-8 border-t border-white/10 space-y-4 relative z-10">
              <div className="flex justify-between items-center text-slate-400 font-bold px-4">
                 <span>Sous-total</span>
                 <span>{(subtotal / 100).toFixed(2)}$</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 font-bold px-4">
                 <span>Taxes (TPS/TVQ)</span>
                 <span>{(taxes / 100).toFixed(2)}$</span>
              </div>

              {insuranceCoveragePercent > 0 ? (
                <>
                  <div className="flex justify-between items-center text-emerald-400 font-bold px-4 pt-2">
                     <span className="flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4" />
                       Part Assurance ({insuranceCoveragePercent}%)
                     </span>
                     <span>-{(insuranceShare / 100).toFixed(2)}$</span>
                  </div>
                  <div className="flex justify-between items-center bg-primary text-slate-900 p-6 rounded-3xl mt-4 shadow-xl">
                     <span className="text-lg font-black uppercase tracking-tighter">Part Patient</span>
                     <span className="text-3xl font-black">{(patientShare / 100).toFixed(2)}$</span>
                  </div>
                  <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest mt-2">
                    Total de l'acte : {(total / 100).toFixed(2)}$
                  </p>
                </>
              ) : (
                <div className="flex justify-between items-center bg-primary text-slate-900 p-6 rounded-3xl mt-4 shadow-xl">
                   <span className="text-lg font-black uppercase tracking-tighter">Total à Payer</span>
                   <span className="text-3xl font-black">{(total / 100).toFixed(2)}$</span>
                </div>
              )}

              <Button 
                onClick={handleCreate}
                disabled={selectedItems.length === 0 || isSubmitting}
                className="w-full h-16 rounded-[1.5rem] mt-6 bg-white text-slate-900 hover:bg-slate-100 font-black text-lg transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3"
              >
                 {isSubmitting ? (
                   <span className="animate-pulse">Génération...</span>
                 ) : (
                   <>
                     <Receipt className="h-5 w-5" />
                     Générer la facture
                   </>
                 )}
              </Button>
           </div>
        </div>
      </div>
    </div>
  )
}
