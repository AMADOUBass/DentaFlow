import { Calendar, Phone, Clock, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PublicMobileNav } from '@/components/public/mobile-nav'
import { ConsentBanner } from '@/components/public/consent-banner'
import { Toaster } from 'sonner'
import { getLocaleServer, useTranslations } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const locale = await getLocaleServer()
  const t = useTranslations(locale)
  const clinicName = tenant.charAt(0).toUpperCase() + tenant.slice(1)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary/20">
      {/* Clinical Header */}
      <header className="sticky top-0 z-50 w-full glass-morphism border-b">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
             <I18nLink href="/" className="flex items-center gap-3 group transition-transform active:scale-95 shrink-0">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border shadow-sm group-hover:scale-105 transition-all overflow-hidden p-1.5">
                   <Image src="/icon.png" alt="DentaFlow Icon" width={40} height={40} className="object-contain" />
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
                   <span className="text-sm font-black text-slate-900">1-800-DENTIST</span>
                </div>
                <I18nLink href="/rendez-vous" className="hidden sm:block">
                   <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 shadow-xl shadow-primary/20 group">
                      <Calendar className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> 
                      {t.common.book}
                   </Button>
                </I18nLink>
                <PublicMobileNav clinicName={clinicName} />
             </div>
          </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Clinical Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2 grayscale opacity-50">
                 <Image src="/icon.png" alt="DentaFlow" width={20} height={20} className="object-contain" />
                 <span className="text-xs font-black uppercase tracking-widest leading-none">{clinicName}</span>
              </div>
              
              <div className="flex gap-8">
                 <I18nLink href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">{t.clinic.privacy}</I18nLink>
                 <I18nLink href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">{t.clinic.law25_officer}</I18nLink>
              </div>

              <p className="text-xs font-bold text-slate-300 italic">
                 {t.clinic.powered_by} <span className="text-primary not-italic inline-flex items-center gap-1">
                    <Image src="/icon.png" alt="" width={14} height={14} /> DentaFlow
                 </span>
              </p>
           </div>
        </div>
      </footer>
      
      <ConsentBanner />
      <Toaster position="top-right" />
    </div>
  )
}
