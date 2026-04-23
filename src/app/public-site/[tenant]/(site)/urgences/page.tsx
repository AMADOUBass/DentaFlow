import { AlertTriangle, Clock, Phone } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import { EmergencyForm } from './emergency-form'

export default async function UrgencesPage() {
  const tenant = await getTenant()
  
  if (!tenant) {
    return notFound()
  }

  return (
    <div className="py-20 bg-rose-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
           
           <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-xs font-black uppercase tracking-widest">
                 <AlertTriangle className="h-3 w-3" /> Priorité Immédiate
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                 Une urgence <br />
                 <span className="text-rose-600 italic">dentaire ?</span>
              </h1>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                 Douleur vive, dent cassée ou abcès ? Ne restez pas dans la souffrance. Notre protocole d'urgence vous garantit une prise en charge prioritaire.
              </p>

              <div className="space-y-4">
                 <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-100/50 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                       <Phone className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Ligne d'urgence</p>
                       <p className="text-2xl font-black text-slate-900">{tenant.phone}</p>
                    </div>
                 </div>
                 
                 <div className="p-6 bg-white rounded-3xl border border-slate-100 flex gap-4 items-center opacity-80">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <p className="text-sm font-bold text-slate-500">Temps d'attente estimé : <span className="text-slate-900">15 minutes</span></p>
                 </div>
              </div>
           </div>

           <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl shadow-rose-200/40 glass-card animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Signalement Rapide</h2>
              
              <EmergencyForm tenantId={tenant.id} />
              
              <p className="mt-6 text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">
                 Vos données sont sécurisées (Loi 25)
              </p>
           </Card>

        </div>
      </div>
    </div>
  )
}
