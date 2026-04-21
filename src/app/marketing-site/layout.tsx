import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getLocaleServer, useTranslations } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oros | Gestion Dentaire Nouvelle Génération au Québec',
  description: 'La plateforme de gestion dentaire la plus efficace et conforme à la Loi 25. Optimisez votre clinique avec notre solution multi-tenant innovante.',
  openGraph: {
    title: 'Oros - Redéfinissez la gestion dentaire',
    description: 'La solution québécoise pour les cliniques dentaires modernes.',
    url: 'https://oros.ca',
    siteName: 'Oros',
    locale: 'fr_CA',
    type: 'website',
  },
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
               <Image src="/icon.png" alt="Oros" width={40} height={40} className="object-contain" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 group-hover:text-primary transition-colors">Oros</span>
          </I18nLink>
          
          <nav className="hidden md:flex items-center gap-10">
            <I18nLink href="/#features" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">{t.nav.features}</I18nLink>
            <I18nLink href="/solutions" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">{t.nav.solutions}</I18nLink>
            <I18nLink href="/pricing" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">{t.nav.pricing}</I18nLink>
            <I18nLink href="/contact" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">{t.nav.contact}</I18nLink>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <I18nLink href="/login">
              <Button variant="ghost" className="font-semibold rounded-xl px-6">{t.common.login}</Button>
            </I18nLink>
            <I18nLink href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 shadow-xl shadow-primary/20">{t.common.demo}</Button>
            </I18nLink>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow">
        {children}
      </main>

      {/* Expanded Footer Heritage */}
      <footer className="bg-white border-t mt-auto relative z-10 py-20 pb-12">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
              <div className="col-span-2 md:col-span-1 space-y-6">
                 <I18nLink href="/" className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center p-1">
                       <Image src="/icon.png" alt="Oros" width={32} height={32} />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-slate-900">Oros</span>
                 </I18nLink>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed leading-relaxed">
                    Plateforme de gestion dentaire conçue au Québec pour les cliniques qui visent l'excellence.
                 </p>
              </div>

              <div className="space-y-6">
                 <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900">{t.footer_ext.product}</h4>
                 <ul className="space-y-4">
                    <li><I18nLink href="/solutions" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">{t.footer_ext.solutions}</I18nLink></li>
                    <li><I18nLink href="/pricing" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">{t.footer_ext.pricing}</I18nLink></li>
                    <li><I18nLink href="http://demo.lvh.me:3000/fr" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">{t.footer_ext.demo}</I18nLink></li>
                 </ul>
              </div>

              <div className="space-y-6">
                 <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900">{t.footer_ext.legal}</h4>
                 <ul className="space-y-4">
                    <li><I18nLink href="/privacy" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">{t.footer_ext.privacy}</I18nLink></li>
                    <li><I18nLink href="/terms" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">{t.footer_ext.terms}</I18nLink></li>
                 </ul>
              </div>

              <div className="space-y-6">
                 <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900">{t.footer_ext.contact}</h4>
                 <ul className="space-y-4">
                    <li><I18nLink href="/contact" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">{t.footer_ext.contact}</I18nLink></li>
                    <li><a href="#" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">{t.footer_ext.support}</a></li>
                 </ul>
              </div>
           </div>

           <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
              <p className="text-xs text-slate-400 font-black tracking-widest uppercase">
                 {t.footer.copy}
              </p>
              <div className="flex items-center gap-6">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">LN</div>
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">IG</div>
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">FB</div>
              </div>
           </div>
        </div>
      </footer>
    </div>
  )
}
