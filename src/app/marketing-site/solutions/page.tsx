import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShieldCheck, 
  MousePointer2, 
  Smartphone,
  ChevronRight,
  Database,
  Lock,
  Zap
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { getLocaleServer } from '@/lib/i18n-server'
import { I18nLink } from '@/components/I18nLink'
import Image from 'next/image'

export default async function SolutionsPage() {
  const locale = await getLocaleServer()
  const t = useTranslations(locale)

  return (
    <div className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* HERO */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight animate-in fade-in slide-in-from-top-4 duration-500">
            {t.solutions_page.hero_title}
            <span className="text-primary italic"> {t.solutions_page.hero_accent}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-top-6 duration-700">
            {t.solutions_page.hero_subtitle}
          </p>
        </div>

        {/* DETAILED FEATURES */}
        <div className="space-y-32">
          {/* LOI 25 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200">
                <Lock className="h-8 w-8" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {t.solutions_page.section_law25_title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {t.solutions_page.section_law25_desc}
              </p>
              <ul className="space-y-4">
                {['Serveurs au Québec', 'Chiffrement AES-256', 'Journalisation complète'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                    <Zap className="h-5 w-5 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-2 rounded-[3rem] border-2 border-white/60 shadow-2xl order-1 lg:order-2 overflow-hidden">
                <Image 
                  src="/assets/images/clinic-interior.png" 
                  alt="Modern Dental Clinic Interior" 
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-[2.5rem] object-cover"
                />
            </div>
          </div>

          {/* BOOKING */}
          <div className="grid lg:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-right-8 duration-700">
             <div className="glass-card p-2 rounded-[3rem] border-2 border-white/60 shadow-2xl overflow-hidden">
                <Image 
                  src="/assets/images/dashboard-preview.png" 
                  alt="AI Booking Engine Preview" 
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-[2.5rem] object-cover"
                />
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                  <Smartphone className="h-8 w-8" />
                </div>
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest bg-emerald-100 text-emerald-700 border-emerald-200">
                  {t.common.soon}
                </Badge>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {t.solutions_page.section_booking_title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {t.solutions_page.section_booking_desc}
              </p>
              <I18nLink href="/login">
                <Button className="h-14 px-8 bg-slate-900 text-white font-bold rounded-2xl group">
                   Essayer le moteur <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </I18nLink>
            </div>
          </div>
        </div>

        {/* CTA BOTTOM */}
        <div className="mt-32 p-12 md:p-24 bg-[#0f172a] rounded-[3rem] text-center space-y-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight relative z-10">
              Prêt à moderniser <br /> votre clinique ?
           </h2>
           <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <I18nLink href="/login">
                <button className="h-16 px-10 bg-white text-[#0f172a] hover:bg-slate-100 font-black rounded-2xl shadow-xl transition-all duration-300 active:scale-95">
                   Démarrer maintenant
                </button>
              </I18nLink>
              <I18nLink href="http://demo.lvh.me:3000/fr">
                <button 
                  className="h-16 px-10 text-white border-2 border-white/40 hover:bg-white hover:text-[#0f172a] hover:border-white font-bold rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center"
                >
                   Voir la démo live
                </button>
              </I18nLink>
           </div>
        </div>
      </div>
    </div>
  )
}
