'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * Bouton de basculement de langue (FR/EN)
 * Design de type "Pill Toggle" pour une meilleure ergonomie
 */
export function LanguageSwitcher() {
  const pathname = usePathname()
  
  // Détection robuste du premier segment
  const segments = pathname.split('/')
  const currentLocale = (segments[1] === 'en' || segments[1] === 'fr') ? segments[1] : 'fr'

  const setLanguage = (newLocale: 'fr' | 'en') => {
    if (newLocale === currentLocale) return
    
    let newPathname = ''
    if (segments[1] === 'fr' || segments[1] === 'en') {
      const newSegments = [...segments]
      newSegments[1] = newLocale
      newPathname = newSegments.join('/')
    } else {
      // Cas où la langue n'est pas dans l'URL (ex: racine pure)
      newPathname = `/${newLocale}${pathname === '/' ? '' : pathname}`
    }
    
    // Nettoyage des doubles slashes éventuels
    newPathname = newPathname.replace(/\/+$/, '') || '/'
    if (newPathname === '') newPathname = '/'
    
    window.location.href = newPathname
  }

  return (
    <div className="relative inline-flex items-center p-1 bg-slate-100/80 backdrop-blur-sm rounded-full shadow-inner border border-slate-200/60 transition-colors hover:bg-slate-200/50">
      {/* Sliding Background */}
      <div 
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-slate-100 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          currentLocale === 'en' ? "translate-x-full ml-1" : "translate-x-0"
        )}
      />
      
      {/* FR Button */}
      <button
        onClick={() => setLanguage('fr')}
        className={cn(
          "relative w-12 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          currentLocale === 'fr' ? "text-primary" : "text-slate-500 hover:text-slate-700"
        )}
        aria-label="Changer la langue vers le français"
        aria-current={currentLocale === 'fr' ? 'true' : undefined}
      >
        FR
      </button>
      
      {/* EN Button */}
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "relative w-12 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          currentLocale === 'en' ? "text-primary" : "text-slate-500 hover:text-slate-700"
        )}
        aria-label="Change language to English"
        aria-current={currentLocale === 'en' ? 'true' : undefined}
      >
        EN
      </button>
    </div>
  )
}
