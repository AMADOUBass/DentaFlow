import { Button } from '@/components/ui/button'
import { 
  ChevronRight, 
  MapPin, 
  Clock, 
  Star, 
  CalendarCheck, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const clinicName = tenant.charAt(0).toUpperCase() + tenant.slice(1)

  return (
    <div className="flex flex-col relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
      
      {/* HERO SECTION - Clinical Focus */}
      <section className="relative pt-12 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="h-3 w-3 fill-primary" /> Expertise de pointe
                 </div>

                 <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                    Votre sourire mérite <br />
                    <span className="text-primary italic text-glow">l'excellence.</span>
                 </h1>

                 <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                    Bienvenue au Centre {clinicName}. Nous combinons technologie moderne et soins personnalisés pour assurer votre santé bucco-dentaire au quotidien.
                 </p>

                 <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 group">
                       Prendre rendez-vous <CalendarCheck className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </Button>
                    <div className="flex items-center gap-4 px-6 border-l-2 border-slate-200">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>)}
                       </div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest line-clamp-1">Déjà +2k Patients</p>
                    </div>
                 </div>
              </div>

              <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
                 <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-primary/20 to-cyan-500/10 overflow-hidden relative group">
                    <div className="absolute inset-0 mesh-gradient opacity-40"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                       <div className="w-full h-full glass-card rounded-[2.5rem] border-2 border-white/60 shadow-2xl flex flex-col items-center justify-center space-y-6 text-center animate-float">
                          <Users className="h-16 w-16 text-primary opacity-50" />
                          <h3 className="text-2xl font-black text-slate-900">Une équipe à <br />votre écoute</h3>
                          <p className="text-sm text-slate-500 px-8">6 Praticiens spécialisés pour vous accompagner dans tous vos soins.</p>
                       </div>
                    </div>
                 </div>
                 
                 {/* Floating badge */}
                 <div className="absolute top-10 -left-10 glass-card p-5 rounded-3xl space-y-1 animate-in zoom-in duration-1000 delay-300">
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-none">4.9/5 Avis Google</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* QUICK INFO BAR */}
      <section className="bg-white py-12 border-y">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { icon: <MapPin className="text-primary" />, title: "Notre Emplacement", info: "123 Rue de la Santé, Québec" },
                  { icon: <Clock className="text-primary" />, title: "Heures d'ouverture", info: "Lun-Ven: 8h - 18h" },
                  { icon: <Clock className="text-primary" />, title: "Urgences 24/7", info: "Réponse sous 30 mins" }
               ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5">
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                        {item.icon}
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{item.title}</h4>
                        <p className="text-slate-500 font-medium">{item.info}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24">
         <div className="container mx-auto px-4 text-center space-y-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
               Prêt à prendre soin de <br /> votre <span className="text-primary italic">santé dentaire</span> ?
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
               <Link href="/services">
                  <Button variant="outline" className="h-16 px-10 text-lg font-bold rounded-2xl border-2 hover:bg-slate-50 transition-all group">
                     Nos Services <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </Link>
               <Link href="/urgences">
                  <Button variant="destructive" className="h-16 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-rose-200">
                     Gérer une urgence
                  </Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  )
}
