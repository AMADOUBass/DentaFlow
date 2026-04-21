import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  ShieldCheck, 
  Clock, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Activity, 
  Stethoscope, 
  Smartphone,
  Star
} from 'lucide-react'
import { getLocaleServer, useTranslations } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default async function MarketingPage() {
  const locale = await getLocaleServer()
  const t = useTranslations(locale)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-primary/20">
      {/* Dynamic Mesh Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 mesh-gradient opacity-60"></div>
      </div>

      {/* Modern Navigation */}
      <header className="sticky top-0 z-50 w-full glass-morphism border-b">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <I18nLink href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border group-hover:rotate-6 transition-transform overflow-hidden p-1.5">
               <Image src="/icon.png" alt="DentaFlow" width={40} height={40} className="object-contain" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 group-hover:text-primary transition-colors">DentaFlow</span>
          </I18nLink>
          
          <nav className="hidden md:flex items-center gap-10">
            <I18nLink href="#features" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">{t.nav.features}</I18nLink>
            <I18nLink href="#solutions" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">{t.nav.solutions}</I18nLink>
            <I18nLink href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">{t.nav.pricing}</I18nLink>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <I18nLink href="/login">
              <Button variant="ghost" className="font-semibold rounded-xl px-6">{t.common.login}</Button>
            </I18nLink>
            <I18nLink href="#demo">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 shadow-xl shadow-primary/20">{t.common.demo}</Button>
            </I18nLink>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION - The "WOW" Opener */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Star className="h-3 w-3 fill-primary" /> {t.home.badge}
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-[1.1]">
                {t.home.hero_title_part1} <span className="text-primary italic text-glow">{t.home.hero_title_accent}</span>.
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1200">
                {t.home.hero_subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1500">
                <I18nLink href="/login">
                  <Button className="h-16 px-10 text-lg font-bold rounded-2xl bg-slate-900 border-none hover:bg-slate-800 text-white shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 group">
                    {t.common.start} 
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </I18nLink>
                <I18nLink href="#demo">
                  <Button variant="outline" className="h-16 px-10 text-lg font-bold rounded-2xl border-2 glass-morphism hover:bg-white/80 transition-all">
                    {t.common.see_demo}
                  </Button>
                </I18nLink>
              </div>
            </div>

            {/* Floating Visual Elements */}
            <div className="mt-20 relative flex justify-center animate-in zoom-in fade-in duration-1000">
               <div className="relative w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden glass-card p-4 border-2 border-white/40 shadow-2xl animate-float">
                  <div className="w-full h-full rounded-[2rem] bg-slate-800 overflow-hidden relative group">
                     <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-cyan-500/20 mix-blend-overlay"></div>
                     <div className="p-8 space-y-6 text-white/50 font-mono text-[10px]">
                        <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/20">
                           <div className="flex gap-4">
                              <div className="w-3 h-3 rounded-full bg-red-400"></div>
                              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                           </div>
                           <div className="w-32 h-2 rounded-full bg-white/10"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                           <div className="h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">Dashboard</div>
                           <div className="h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">Planning</div>
                           <div className="h-32 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">Analytics</div>
                        </div>
                        <div className="h-48 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs">Patient Records (Encrypted Law 25)</div>
                     </div>
                  </div>
               </div>

               {/* Stats Badges */}
               <div className="absolute -left-8 top-1/2 -translate-y-1/2 glass-card p-6 rounded-3xl space-y-2 hidden lg:block animate-in slide-in-from-left-20 duration-1000">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.home.stats_save_time}</p>
                  <p className="text-4xl font-black text-primary">+45%</p>
                  <p className="text-xs text-slate-400">{t.home.stats_per_week}</p>
               </div>
               <div className="absolute -right-8 bottom-20 glass-card p-6 rounded-3xl space-y-2 hidden lg:block animate-in slide-in-from-right-20 duration-1000">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.home.stats_satisfaction}</p>
                  <div className="flex gap-1">
                     {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID - Modern 3D Style */}
        <section id="features" className="py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900">{t.features.title}</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">{t.features.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  icon: <Calendar className="h-7 w-7" />, 
                  title: t.features.items.booking.title, 
                  description: t.features.items.booking.desc,
                  color: "bg-blue-500" 
                },
                { 
                  icon: <ShieldCheck className="h-7 w-7" />, 
                  title: t.features.items.law25.title, 
                  description: t.features.items.law25.desc,
                  color: "bg-emerald-500" 
                },
                { 
                  icon: <Activity className="h-7 w-7" />, 
                  title: t.features.items.dashboard.title, 
                  description: t.features.items.dashboard.desc,
                  color: "bg-indigo-500" 
                },
                { 
                  icon: <Smartphone className="h-7 w-7" />, 
                  title: t.features.items.pwa.title, 
                  description: t.features.items.pwa.desc,
                  color: "bg-amber-500" 
                },
                { 
                  icon: <Clock className="h-7 w-7" />, 
                  title: t.features.items.emergency.title, 
                  description: t.features.items.emergency.desc,
                  color: "bg-rose-500" 
                },
                { 
                  icon: <Stethoscope className="h-7 w-7" />, 
                  title: t.features.items.practitioner.title, 
                  description: t.features.items.practitioner.desc,
                  color: "bg-cyan-500" 
                }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(15,118,110,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className={`w-16 h-16 ${feature.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                  
                  {/* Decorative background element */}
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-4 text-center md:text-left">
                   <h2 className="text-4xl font-black tracking-tight">{t.trust.title}</h2>
                   <p className="text-slate-400 text-lg">{t.trust.subtitle}</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-center">
                      <p className="text-3xl font-black">99.9%</p>
                      <p className="text-xs text-slate-500 uppercase font-bold mt-1">{t.trust.availability}</p>
                   </div>
                   <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
                   <div className="text-center">
                      <p className="text-3xl font-black">1.2M+</p>
                      <p className="text-xs text-slate-500 uppercase font-bold mt-1">{t.trust.appointments}</p>
                   </div>
                   <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
                   <I18nLink href="#demo">
                      <Button className="h-14 px-8 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl">
                         {t.trust.cta}
                      </Button>
                   </I18nLink>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm font-medium italic">
            {t.footer.copy}
          </p>
        </div>
      </footer>
    </div>
  )
}
