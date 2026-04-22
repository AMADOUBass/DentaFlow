import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  HelpCircle,
  Zap,
  Shield,
  Crown
} from 'lucide-react'
import { getLocaleServer, useTranslations } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'

export default async function PricingPage() {
  const locale = await getLocaleServer()
  const t = useTranslations(locale)

  return (
    <div className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">
             {t.pricing_page.hero_title}
             <span className="text-primary italic"> {t.pricing_page.hero_accent}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
             {t.pricing_page.hero_subtitle}
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto lg:items-center">
          {/* ESSENTIEL */}
          <div className="glass-card p-10 rounded-[2.5rem] border border-slate-200 space-y-8 hover:border-primary/20 transition-all">
             <div className="space-y-2">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                   <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{t.pricing_page.plans.essentiel.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{t.pricing_page.plans.essentiel.desc}</p>
             </div>
             <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900">${t.pricing_page.plans.essentiel.price}</span>
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ mois</span>
             </div>
             <ul className="space-y-4">
                {t.pricing_page.plans.essentiel.features.map((f, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {f}
                   </li>
                ))}
             </ul>
             <I18nLink href="/register" className="block">
                <Button variant="outline" className="w-full h-14 rounded-xl border-2 font-black">Choisir Essentiel</Button>
             </I18nLink>
          </div>

          {/* COMPLET - Featured */}
          <div className="relative group lg:scale-110">
             <div className="absolute inset-0 bg-primary blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
             <div className="relative glass-card p-12 rounded-[3rem] border-2 border-primary bg-white space-y-10 shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                   Populaire
                </div>
                <div className="space-y-2">
                   <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <Shield className="h-7 w-7" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900">{t.pricing_page.plans.complet.name}</h3>
                   <p className="text-sm text-slate-500 font-bold">{t.pricing_page.plans.complet.desc}</p>
                </div>
                <div className="flex items-baseline gap-1">
                   <span className="text-6xl font-black text-slate-900">${t.pricing_page.plans.complet.price}</span>
                   <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">/ mois</span>
                </div>
                <ul className="space-y-5">
                   {t.pricing_page.plans.complet.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-700">
                         <CheckCircle2 className="h-5 w-5 text-primary" /> {f}
                      </li>
                   ))}
                </ul>
                <I18nLink href="/register" className="block">
                   <Button className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                      Démarrer l'essai
                   </Button>
                </I18nLink>
             </div>
          </div>

          {/* PREMIUM */}
          <div className="glass-card p-10 rounded-[2.5rem] border border-slate-200 space-y-8 hover:border-primary/20 transition-all">
             <div className="space-y-2">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                   <Crown className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{t.pricing_page.plans.premium.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{t.pricing_page.plans.premium.desc}</p>
             </div>
             <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900">${t.pricing_page.plans.premium.price}</span>
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ mois</span>
             </div>
             <ul className="space-y-4">
                {t.pricing_page.plans.premium.features.map((f, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {f}
                   </li>
                ))}
             </ul>
             <I18nLink href="/register" className="block">
                <Button variant="outline" className="w-full h-14 rounded-xl border-2 font-black">Nous contacter</Button>
             </I18nLink>
          </div>
        </div>

        {/* FAQ - Quick */}
        <div className="mt-48 max-w-4xl mx-auto space-y-12">
           <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-slate-900">Questions fréquentes</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Transparence totale</p>
           </div>
           
           <div className="grid md:grid-cols-2 gap-12">
              {[
                { q: "Puis-je changer de plan ?", a: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis votre dashboard." },
                { q: "Qu'est-ce que la conformité Loi 25 ?", a: "C'est l'assurance que les données de vos patients sont stockées et gérées selon les normes de sécurité du Québec." },
                { q: "Y a-t-il des frais d'installation ?", a: "Non, chez Oros l'installation et la configuration initiale sont incluses dans tous nos plans." },
                { q: "Comment fonctionne l'essai gratuit ?", a: "Vous bénéficiez de 14 jours pour explorer toutes les fonctionnalités sans engagement." }
              ].map((faq, i) => (
                <div key={i} className="space-y-3 p-8 bg-white rounded-3xl border border-slate-100">
                   <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <h4 className="font-black text-slate-900 tracking-tight">{faq.q}</h4>
                   </div>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium pl-8">{faq.a}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
