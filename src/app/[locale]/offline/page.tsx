'use client'

import { WifiOff, Phone, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { I18nLink } from '@/components/I18nLink'
import { getTranslations } from '@/lib/i18n'
import { useParams } from 'next/navigation'

export default function OfflinePage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const t = getTranslations(locale as any)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-8 relative">
        <WifiOff className="h-12 w-12 text-slate-300" />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 rounded-full border-4 border-slate-50 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        </div>
      </div>

      <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
        {locale === 'fr' ? 'Vous êtes hors-ligne' : 'You are offline'}
      </h1>
      
      <p className="text-slate-500 max-w-md mb-12 font-medium">
        {locale === 'fr' 
          ? "Il semble que votre connexion internet soit interrompue. Ne vous inquiétez pas, vos données sont en sécurité."
          : "It looks like your internet connection is down. Don't worry, your data is safe."
        }
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
        <I18nLink href="/">
          <Button variant="outline" className="w-full h-14 rounded-2xl gap-2 font-bold text-slate-700 border-slate-200">
            <Home className="h-4 w-4" />
            {locale === 'fr' ? 'Accueil' : 'Home'}
          </Button>
        </I18nLink>
        <Button 
          onClick={() => window.location.reload()} 
          className="w-full h-14 rounded-2xl gap-2 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
        >
          {locale === 'fr' ? 'Réessayer' : 'Retry'}
        </Button>
      </div>

      <div className="mt-16 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm max-w-xs w-full">
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 text-center">
            {locale === 'fr' ? 'Urgence dentaire ?' : 'Dental Emergency?'}
         </p>
         <div className="flex items-center justify-center gap-3 text-primary">
            <Phone className="h-5 w-5" />
            <span className="text-lg font-black tracking-tighter">Oros | DentaFlow</span>
         </div>
      </div>
    </div>
  )
}
