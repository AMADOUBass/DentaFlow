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
  Star
} from 'lucide-react'
import { getLocaleServer, useTranslations } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'
import { Testimonials } from '@/components/marketing/Testimonials'

/**
 * Page d'accueil marketing simplifiée et enrichie
 */
export default async function MarketingPage() {
  const locale = await getLocaleServer()
  const t = useTranslations(locale)

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Star className="h-3 w-3 fill-primary" /> {t.home.badge}
            </div>
            
            <h1 className="text-4xl md:text-8xl font-black tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-[1.1]">
              {t.home.hero_title_part1} <span className="text-primary italic text-glow">{t.home.hero_title_accent}</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1200">
              {t.home.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1500">
              <I18nLink href="/login" className="w-full sm:w-auto">
                <button className="w-full h-16 px-10 bg-white text-[#0f172a] hover:bg-slate-100 font-black rounded-2xl shadow-xl transition-all duration-300 active:scale-95">
                  {t.common.start} 
                  <ChevronRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
                </button>
              </I18nLink>
              <I18nLink href="http://demo.lvh.me:3000/fr" className="w-full sm:w-auto">
                <button className="w-full h-16 px-10 text-slate-900 border-2 border-slate-200 glass-morphism hover:bg-white/80 transition-all font-bold rounded-2xl active:scale-95">
                  {t.common.see_demo}
                </button>
              </I18nLink>
            </div>
          </div>

          {/* Floating Visual Elements */}
          <div className="mt-20 relative flex justify-center animate-in zoom-in fade-in duration-1000">
             <div className="relative w-full max-w-5xl rounded-[2.5rem] overflow-hidden glass-card p-4 border-2 border-white/40 shadow-2xl animate-float">
                <img 
                  src="/marketing/hero.png" 
                  alt="Oros Healthcare Platform" 
                  className="w-full h-full rounded-[2rem] object-cover shadow-inner"
                />
             </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">{t.features.title}</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(t.features.items).map(([key, item]) => (
              <div 
                key={key} 
                className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(15,118,110,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
                  {key === 'booking' && <Calendar className="h-7 w-7" />}
                  {key === 'law25' && <ShieldCheck className="h-7 w-7" />}
                  {key === 'dashboard' && <Activity className="h-7 w-7" />}
                  {key === 'pwa' && <Smartphone className="h-7 w-7" />}
                  {key === 'emergency' && <Clock className="h-7 w-7" />}
                  {key === 'practitioner' && <Stethoscope className="h-7 w-7" />}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{item.title}</h3>
                  {key === 'booking' && (
                    <Badge variant="secondary" className="px-2 py-0 rounded-full font-black text-[9px] uppercase tracking-widest bg-emerald-100 text-emerald-700 border-emerald-200">
                      {t.common.soon}
                    </Badge>
                  )}
                </div>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <Testimonials 
        title={t.testimonials.title}
        subtitle={t.testimonials.subtitle}
        items={t.testimonials.items}
      />

      {/* TRUST SECTION */}
      <section className="py-32 bg-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-16">
           <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">{t.trust.title}</h2>
              <p className="text-slate-400 text-lg font-medium">{t.trust.subtitle}</p>
           </div>
           
           <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
              <div className="text-center space-y-2">
                 <p className="text-5xl font-black text-white">99.9%</p>
                 <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{t.trust.availability}</p>
              </div>
              <div className="hidden md:block w-px h-16 bg-white/10"></div>
              <div className="text-center space-y-2">
                 <p className="text-5xl font-black text-primary">1.2M+</p>
                 <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{t.trust.appointments}</p>
              </div>
           </div>

           <div className="pt-8">
              <I18nLink href="/login">
                <button className="h-16 px-12 bg-white text-[#0f172a] hover:bg-slate-100 font-black rounded-2xl shadow-2xl transition-all duration-300 active:scale-95">
                   {t.trust.cta}
                </button>
              </I18nLink>
           </div>
        </div>
      </section>
    </>
  )
}
