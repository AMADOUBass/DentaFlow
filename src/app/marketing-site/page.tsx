import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShieldCheck, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Activity, 
  Stethoscope, 
  Smartphone,
  Star,
  ArrowRight
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { getLocaleServer } from '@/lib/i18n-server'
import { I18nLink } from '@/components/I18nLink'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'

const Testimonials = dynamic(() => import('@/components/marketing/Testimonials').then(mod => mod.Testimonials), {
  ssr: true,
  loading: () => <div className="py-32 bg-slate-50/50 animate-pulse h-[600px]" />
})

/**
 * Page d'accueil marketing simplifiée et enrichie
 */
export default async function MarketingPage() {
  const locale = await getLocaleServer()
  const t = useTranslations(locale)

  return (
    <>
      {/* HERO SECTION - REFINED PROPORTIONS */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-32 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-primary/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-cyan-500/10 rounded-full blur-[100px] animate-bounce duration-[15s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/assets/images/grid.svg')] opacity-[0.02]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10">
            {/* Top Badge */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="inline-flex items-center gap-2 p-1 pr-4 rounded-full bg-slate-900/5 border border-slate-900/10 backdrop-blur-sm group cursor-pointer hover:border-primary/30 transition-all">
                <span className="bg-primary text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">Nouveau</span>
                <span className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors flex items-center gap-1">
                  Découvrez le moteur de réservation IA <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>

            {/* Title - Scaled Down */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] md:leading-[1] text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {t.home.hero_title_part1} <br />
              <span className="text-gradient drop-shadow-sm italic">
                {t.home.hero_title_accent}
              </span>.
            </h1>

            {/* Subtitle - Refined size */}
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1200 font-medium">
              {t.home.hero_subtitle}
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1500">
              <I18nLink href="/login">
                <Button className="h-14 px-8 text-base font-black bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl shadow-xl shadow-slate-900/20 group">
                  {t.common.start}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </I18nLink>
              <I18nLink href="http://demo.lvh.me:3000/fr">
                <Button variant="outline" className="h-14 px-8 text-base font-black rounded-xl border-2 hover:bg-slate-50 transition-all">
                  {t.common.see_demo}
                </Button>
              </I18nLink>
            </div>

            {/* Trust Logos Placeholder */}
            <div className="pt-16 opacity-50 grayscale animate-in fade-in duration-1000 delay-1000">
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Propulsé par la technologie de pointe</p>
               <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                  <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-slate-700"><ShieldCheck className="h-5 w-5" /> SECURE</div>
                  <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-slate-700"><Activity className="h-5 w-5" /> PULSE</div>
                  <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-slate-700"><Clock className="h-5 w-5" /> 24/7</div>
                  <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-slate-700"><Smartphone className="h-5 w-5" /> NATIVE</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION - BENTO GRID */}
      <section id="features" className="py-24 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mb-20">
             <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20 px-3 py-0.5 mb-4 text-[10px] font-black uppercase tracking-widest">Plateforme Intégrée</Badge>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                {t.features.title}
             </h2>
             <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {t.features.subtitle}
             </p>
          </div>

          {/* Bento Grid Layout - Refined gap and padding */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[280px]">
             {/* Large Feature 1: Booking */}
             <div className="md:col-span-8 md:row-span-2 bento-item group p-0 border-slate-200/60">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-cyan-500/[0.03] -z-10" />
                <div className="p-10 space-y-5">
                   <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                      <Calendar className="h-7 w-7" />
                   </div>
                   <div className="space-y-3 max-w-md">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                         {t.features.items.booking.title}
                         <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none uppercase text-[8px] font-black tracking-widest">{t.common.soon}</Badge>
                      </h3>
                      <p className="text-base text-slate-500 font-medium leading-relaxed">
                         {t.features.items.booking.desc}
                      </p>
                   </div>
                </div>
                {/* Visual Representation of Dashboard */}
                <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-white rounded-tl-[3rem] border-t border-l border-slate-100 shadow-2xl overflow-hidden p-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                   <div className="w-full h-full rounded-2xl bg-slate-50 p-4 space-y-4">
                      <div className="flex justify-between items-center">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aujourd'hui</div>
                         <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-primary/20">AB</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 space-y-1">
                            <p className="text-[10px] font-black text-slate-900">Dr. Simard</p>
                            <p className="text-[8px] text-primary font-bold">14:00 - Chirurgie</p>
                         </div>
                         <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 space-y-1">
                            <p className="text-[10px] font-black text-slate-900">Dr. Bass</p>
                            <p className="text-[8px] text-primary font-bold">15:30 - Examen</p>
                         </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                         <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-4 w-4 text-emerald-600" />
                         </div>
                         <div className="flex-1">
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div className="w-3/4 h-full bg-emerald-500" />
                            </div>
                            <p className="text-[8px] font-bold text-slate-400 mt-1">Capacité: 85%</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Side Feature: Law 25 */}
             <div className="md:col-span-4 md:row-span-2 bento-item bg-slate-900 text-white border-none group p-10">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <ShieldCheck className="h-48 w-48" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                   <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="h-7 w-7 text-white" />
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-2xl font-black tracking-tight">{t.features.items.law25.title}</h3>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">
                         {t.features.items.law25.desc}
                      </p>
                      <div className="pt-4">
                         <Button variant="link" className="text-primary font-black p-0 uppercase tracking-widest text-[9px] hover:text-white transition-colors">Découvrir la conformité <ArrowRight className="h-3 w-3 ml-2" /></Button>
                      </div>
                   </div>
                </div>
             </div>

             {/* Small Feature: Dashboard */}
             <div className="md:col-span-4 bento-item group border-slate-200/60">
                <div className="space-y-4">
                   <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center group-hover:rotate-3 transition-transform">
                      <Activity className="h-5 w-5" />
                   </div>
                   <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{t.features.items.dashboard.title}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                         {t.features.items.dashboard.desc}
                      </p>
                   </div>
                </div>
             </div>

             {/* Small Feature: PWA */}
             <div className="md:col-span-4 bento-item group border-slate-200/60">
                <div className="space-y-4">
                   <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:-rotate-3 transition-transform">
                      <Smartphone className="h-5 w-5" />
                   </div>
                   <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{t.features.items.pwa.title}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                         {t.features.items.pwa.desc}
                      </p>
                   </div>
                </div>
             </div>

             {/* Small Feature: Emergency */}
             <div className="md:col-span-4 bento-item group border-slate-200/60">
                <div className="space-y-4">
                   <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Clock className="h-5 w-5" />
                   </div>
                   <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{t.features.items.emergency.title}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                         {t.features.items.emergency.desc}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS FOCUS - REFINED PREMIUM CARD */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4">
            <div className="relative glass-card-dark p-10 md:p-20 rounded-[3rem] overflow-hidden group">
               {/* Background visual detail */}
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.15),transparent_70%)]" />
               
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        Expérience Praticien
                     </div>
                     <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
                        Une interface conçue par et pour les <span className="italic text-primary">experts.</span>
                     </h2>
                     <p className="text-lg text-slate-400 font-medium max-w-lg leading-relaxed">
                        Oros réduit la charge cognitive de vos équipes grâce à une interface épurée et des processus automatisés qui s'adaptent à votre flux de travail.
                     </p>
                     <div className="flex items-center gap-8 pt-2">
                        <div className="space-y-1">
                           <p className="text-3xl font-black text-white">45%</p>
                           <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Moins d'erreurs</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="space-y-1">
                           <p className="text-3xl font-black text-primary">+2h</p>
                           <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Gagnées par jour</p>
                        </div>
                     </div>
                  </div>

                  <div className="relative hidden lg:block">
                     <div className="relative aspect-square max-w-[420px] mx-auto animate-float">
                        <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
                        <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-7 shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                           <div className="space-y-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-primary rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center text-white font-bold">M</div>
                                 <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white">Marie-Claude Lemay</p>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Patiente #2940</p>
                                 </div>
                              </div>
                              <div className="h-px bg-white/10" />
                              <div className="space-y-4">
                                 <div className="flex gap-2">
                                    <div className="w-1/2 bg-white/5 rounded-xl border border-white/5 p-3 space-y-1.5">
                                       <p className="text-[8px] text-slate-500 font-black uppercase">Statut</p>
                                       <p className="text-[10px] text-emerald-400 font-bold">Confirmé</p>
                                    </div>
                                    <div className="w-1/2 bg-white/5 rounded-xl border border-white/5 p-3 space-y-1.5">
                                       <p className="text-[8px] text-slate-500 font-black uppercase">Soin</p>
                                       <p className="text-[10px] text-white font-bold">Nettoyage</p>
                                    </div>
                                 </div>
                                 <div className="bg-primary/10 rounded-xl border border-primary/20 p-4 space-y-3">
                                    <p className="text-[10px] text-white font-black">Notes Cliniques</p>
                                    <p className="text-[8px] text-slate-400 leading-relaxed font-medium">Suivi post-opératoire requis pour la dent #14. Sensibilité légère rapportée.</p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex justify-between items-center pt-4">
                              <p className="text-[10px] text-slate-500 font-bold italic">Signé: Dr. Simard</p>
                              <div className="w-20 h-8 bg-primary rounded-lg flex items-center justify-center text-[9px] font-black text-white uppercase tracking-widest">Enregistrer</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <Testimonials 
        title={t.testimonials.title}
        subtitle={t.testimonials.subtitle}
        items={t.testimonials.items}
      />

      {/* TRUST & CTA SECTION - REFINED PROPORTIONS */}
      <section className="py-32 relative overflow-hidden bg-slate-50/50 border-t border-slate-100">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-20">
           <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1]">
                 {t.trust.title}
              </h2>
              <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
                 {t.trust.subtitle}
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col items-center gap-3 group hover:border-primary/20 hover:shadow-xl transition-all duration-500">
                 <p className="text-5xl md:text-6xl font-black text-slate-900 group-hover:text-primary transition-colors">99.9%</p>
                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">{t.trust.availability}</p>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col items-center gap-3 group hover:border-primary/20 hover:shadow-xl transition-all duration-500">
                 <p className="text-5xl md:text-6xl font-black text-primary group-hover:text-slate-900 transition-colors">1.2M+</p>
                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">{t.trust.appointments}</p>
              </div>
           </div>

           <div className="pt-8">
              <I18nLink href="/login">
                <Button className="h-20 px-12 bg-[#0f172a] text-white hover:bg-slate-800 font-black rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 text-2xl group">
                   {t.trust.cta}
                   <ArrowRight className="ml-4 h-8 w-8 group-hover:translate-x-2 transition-transform" />
                </Button>
              </I18nLink>
           </div>
        </div>
      </section>
    </>
  )
}
