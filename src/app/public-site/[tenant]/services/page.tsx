import { 
  Stethoscope, 
  Sparkles, 
  Baby, 
  Microscope, 
  Ear, 
  ShieldCheck, 
  ArrowRight,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import Image from 'next/image'

const iconMap: Record<string, any> = {
  'ORTHODONTICS': <Microscope className="h-6 w-6" />,
  'PREVENTION': <Stethoscope className="h-6 w-6" />,
  'ESTHETIC': <Sparkles className="h-6 w-6" />,
  'SURGERY': <Ear className="h-6 w-6" />,
  'EMERGENCY': <AlertTriangle className="h-6 w-6" />,
  'GENERIC': <Activity className="h-6 w-6" />
}

function AlertTriangle({ className }: { className?: string }) {
   return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
         <path d="m9 12 2 2 4-4" />
      </svg>
   )
}

export default async function ServicesPage() {
  const tenant = await getTenant()
  
  if (!tenant) return notFound()

  const services = tenant.services

  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Nos Soins & Services</h1>
          <p className="text-xl text-slate-600 font-medium">Une approche technologique au service de votre bien-être bucco-dentaire chez {tenant.name}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length === 0 ? (
             <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic">Aucun service n'est affiché pour le moment.</p>
             </div>
          ) : (
            services.map((service, i) => (
              <div 
                key={service.id} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
              >
                {/* Service Image */}
                <div className="aspect-video relative overflow-hidden">
                   {service.imageUrl ? (
                      <Image 
                        src={service.imageUrl} 
                        alt={service.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                   ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                         <Stethoscope className="h-12 w-12" />
                      </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                   <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm text-primary flex items-center justify-center shadow-lg group-hover:bg-primary group-hover:text-white transition-all">
                        {iconMap[service.category] || <Activity className="h-5 w-5" />}
                      </div>
                   </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{service.name}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6 line-clamp-3">
                    {service.description || "Soins professionnels adaptés à vos besoins."}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {service.priceCents ? `À partir de ${service.priceCents / 100}$` : 'Consultation'}
                    </span>
                    <Button variant="ghost" className="text-primary font-bold group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent">
                        Détails <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-24 bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Prêt pour votre <span className="text-primary italic">transformation ?</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Nos spécialistes sont là pour établir un plan de traitement personnalisé adapté à votre santé et votre budget.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20">
                    Prendre rendez-vous
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-2 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-lg backdrop-blur-sm transition-all">
                    Nous contacter
                </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
