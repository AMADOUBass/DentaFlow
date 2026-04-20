import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { ContactForm } from './contact-form'

export default async function ContactPage() {
  const tenant = await getTenant()

  if (!tenant) {
    notFound()
  }

  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  return (
    <div className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
          
          {/* Info Side (Col 2) */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Parlons de votre <span className="text-primary italic">sourire</span>.
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Notre équipe est à votre disposition pour toute question ou demande d'information.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse</p>
                  <p className="text-slate-900 font-bold leading-snug">
                    {tenant.address}<br />
                    {tenant.city}, {tenant.province} {tenant.postalCode}
                  </p>
                  <button className="text-primary text-xs font-black flex items-center gap-1.5 pt-2 hover:translate-x-1 transition-transform">
                    Voir sur Google Maps <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                  <p className="text-slate-900 font-bold text-xl">{tenant.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Courriel</p>
                  <p className="text-slate-900 font-bold">{tenant.email}</p>
                </div>
              </div>
            </div>

            {/* Heures d'ouverture */}
            <Card className="p-8 rounded-[2.5rem] border-none bg-slate-900 text-white shadow-2xl">
               <div className="flex items-center gap-3 mb-6">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Heures d'ouverture</h3>
               </div>
               <div className="space-y-3">
                  {tenant.businessHours.map((bh) => (
                    <div key={bh.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-400">{days[bh.weekday]}</span>
                      {bh.closed ? (
                        <span className="font-black text-rose-500 uppercase text-[10px] tracking-widest">Fermé</span>
                      ) : (
                        <span className="font-bold text-slate-100">{bh.openTime} — {bh.closeTime}</span>
                      )}
                    </div>
                  ))}
               </div>
            </Card>
          </div>

          {/* Form Side (Col 3) */}
          <div className="lg:col-span-3">
            <Card className="p-10 rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 bg-white relative overflow-hidden">
               {/* Aesthetic badge */}
               <div className="absolute top-0 right-0 p-8">
                  <MessageSquare className="h-20 w-20 text-slate-50 opacity-50" />
               </div>

               <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-black text-slate-900">Une question ?</h2>
                     <p className="text-slate-500 font-medium">Laissez-nous un message et nous vous répondrons rapidement.</p>
                  </div>
                  
                  <ContactForm tenantId={tenant.id} />
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
