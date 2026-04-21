'use client'

import React from 'react'
import { Link, usePathname } from '@/i18n/routing'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  const t = useTranslations('Navigation')

  // On ignore le segment [locale] car usePathname de next-intl le gère déjà
  const segments = pathname.split('/').filter(Boolean)
  
  // Si on est à la racine admin
  if (segments.length <= 1 && segments[0] === 'admin') return null

  return (
    <nav className="flex items-center gap-2 text-xs font-bold mb-6 text-slate-400 overflow-x-auto scrollbar-hide py-1">
      <Link 
        href="/admin/dashboard" 
        className="flex items-center gap-1.5 hover:text-primary transition-colors shrink-0"
      >
        <Home className="h-4 w-4" />
      </Link>

      {segments.map((segment, index) => {
        // On saute le premier "admin" pour ne pas l'avoir en double avec "Oros"
        if (segment === 'admin') return null

        const href = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        
        // On essaie de traduire le segment via notre dictionnaire Navigation
        const label = t.raw(segment) ? t(segment) : segment

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
            {isLast ? (
              <span className="text-slate-900 uppercase tracking-widest truncate max-w-[150px]">
                {label}
              </span>
            ) : (
              <Link 
                href={href as any} 
                className="hover:text-primary transition-colors uppercase tracking-widest shrink-0"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
