'use client'

import { usePathname, useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Bouton de basculement de langue (FR/EN)
 * Change le préfixe de l'URL tout en gardant le reste du chemin
 */
export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  // Détection robuste du premier segment
  const segments = pathname.split('/')
  const currentLocale = (segments[1] === 'en' || segments[1] === 'fr') ? segments[1] : 'fr'

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'fr' ? 'en' : 'fr'
    
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
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
      aria-label={currentLocale === 'fr' ? "Changer la langue vers l'anglais" : "Change language to French"}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className={cn(currentLocale === 'fr' ? "text-primary underline" : "")} aria-current={currentLocale === 'fr' ? 'true' : undefined}>FR</span>
      <span className="text-slate-300" aria-hidden="true">|</span>
      <span className={cn(currentLocale === 'en' ? "text-primary underline" : "")} aria-current={currentLocale === 'en' ? 'true' : undefined}>EN</span>
    </Button>
  )
}
