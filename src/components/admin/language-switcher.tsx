'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const nextLocale = locale === 'fr' ? 'en' : 'fr'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200/50 group"
      title={locale === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      <Globe className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
      <div className="flex divide-x divide-slate-300">
        <span className={cn(
          "px-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
          locale === 'fr' ? "text-primary" : "text-slate-400"
        )}>
          FR
        </span>
        <span className={cn(
          "px-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
          locale === 'en' ? "text-primary" : "text-slate-400"
        )}>
          EN
        </span>
      </div>
    </button>
  )
}
