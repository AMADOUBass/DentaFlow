import { Calendar, Phone, Clock, AlertTriangle, MapPin, Mail } from 'lucide-react'
import NextImage from 'next/image'
import { Button } from '@/components/ui/button'
import { PublicMobileNav } from '@/components/public/mobile-nav'
import { ConsentBanner } from '@/components/public/consent-banner'

import { notFound } from 'next/navigation'
import { useTranslations } from '@/lib/i18n'
import { getLocaleServer as getLocale } from '@/lib/i18n-server'
import { I18nLink } from '@/components/I18nLink'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { getTenant } from '@/lib/tenant'

export default async function TenantSiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const t = useTranslations(locale)
  const tenant = await getTenant()

  if (!tenant) notFound()

  const clinicName = tenant.name

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary/20">
      {/* Clinical Header */}
      <header className="sticky top-0 z-50 w-full glass-morphism border-b">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
             <I18nLink href="/" className="flex items-center gap-3 group transition-transform active:scale-95 shrink-0">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border overflow-hidden p-1.5 grayscale-0">
                   {tenant.logoUrl ? (
                      <NextImage src={tenant.logoUrl} alt={clinicName} width={40} height={40} className="object-contain" />
                   ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm">
                         {clinicName.charAt(0)}
                      </div>
                   )}
                </div>
                <div className="flex flex-col">
                   <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-none">
                      {t.common.team} {clinicName}
                   </span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.clinic.clinic_label}</span>
                </div>
             </I18nLink>

             <nav className="hidden lg:flex items-center gap-8">
                <I18nLink href="/" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">{t.clinic.home}</I18nLink>
                <I18nLink href="/services" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">{t.common.services}</I18nLink>
                <I18nLink href="/equipe" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">{t.clinic.team}</I18nLink>
                <I18nLink href="/contact" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">{t.common.contact}</I18nLink>
                <I18nLink href="/urgences" className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5">
                   <AlertTriangle className="h-3.5 w-3.5" /> {t.clinic.urgencies}
                </I18nLink>
             </nav>

             <div className="flex items-center gap-2 sm:gap-4">
                <LanguageSwitcher />
                <div className="hidden xl:flex flex-col items-end mr-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.clinic.need_help}</span>
                   <span className="text-sm font-black text-slate-900">{tenant.phone}</span>
                </div>
                <I18nLink href="/login/patient" className="hidden sm:block">
                   <Button variant="ghost" className="font-bold rounded-xl text-slate-600 hover:text-primary">
                      {t.common.login}
                   </Button>
                </I18nLink>
                <I18nLink href="/rendez-vous" className="hidden sm:block">
                   <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 shadow-xl shadow-primary/20 group">
                      <Calendar className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> 
                      {t.common.book}
                   </Button>
                </I18nLink>
                <PublicMobileNav clinicName={clinicName} logoUrl={tenant.logoUrl} />
             </div>
          </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Clinical Footer Heritage */}
      <footer className="bg-white border-t mt-auto relative z-10 py-16 pb-12">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center p-1.5">
                       {tenant.logoUrl ? (
                          <NextImage src={tenant.logoUrl} alt={clinicName} width={32} height={32} className="object-contain" />
                       ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-xs rounded-lg">
                             {clinicName.charAt(0)}
                          </div>
                       )}
                    </div>
                    <span className="font-black text-xl tracking-tighter text-slate-900">{clinicName}</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Soins dentaires d'excellence et technologie de pointe au service de votre santé bucco-dentaire.
                 </p>
              </div>

              <div className="space-y-6">
                 <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900">Coordonnées</h4>
                 <div className="space-y-4">
                    <p className="text-sm text-slate-600 font-medium flex items-start gap-3">
                       <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                       <span>{tenant.address}<br />{tenant.city}, {tenant.province} {tenant.postalCode}</span>
                    </p>
                    <p className="text-sm text-slate-600 font-black flex items-center gap-3">
                       <Phone className="h-4 w-4 text-primary shrink-0" />
                       {tenant.phone}
                    </p>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900">Navigation</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <I18nLink href="/services" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">Services</I18nLink>
                    <I18nLink href="/equipe" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">Équipe</I18nLink>
                    <I18nLink href="/contact" className="text-sm text-slate-500 hover:text-primary font-medium transition-colors">Contact</I18nLink>
                    <I18nLink href="/urgences" className="text-sm text-rose-500 hover:text-rose-600 font-bold transition-colors">Urgences</I18nLink>
                 </div>
              </div>
           </div>

           <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
                 © {new Date().getFullYear()} {clinicName} — Tous droits réservés.
              </p>
              <div className="flex items-center gap-8">
                 <I18nLink href="#" className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">{t.clinic.privacy}</I18nLink>
                 <div className="h-4 w-px bg-slate-100" />
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    Powered by <span className="text-primary flex items-center gap-1 opacity-100"><NextImage src="/icon.png" alt="" width={12} height={12} /> Oros</span>
                 </p>
              </div>
           </div>
        </div>
      </footer>
      
      <ConsentBanner />
    </div>
  )
}
