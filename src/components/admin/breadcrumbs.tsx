'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const routeMap: Record<string, string> = {
  admin: 'Dashboard',
  patients: 'Patients',
  appointments: 'Rendez-vous',
  practitioners: 'Praticiens',
  services: 'Services',
  emergencies: 'Urgences',
  settings: 'Paramètres',
  kiosk: 'Borne Kiosque',
  general: 'Général',
  security: 'Sécurité & Loi 25',
  billing: 'Facturation',
  notifications: 'Notifications',
  mobile: 'Application Mobile',
  export: 'Portabilité des Données',
  'check-in': 'Arrivée Patient',
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)

  // Skip the first parts if they are fixed prefixes like 'admin-area'
  // URL structure: /admin-area/admin/...
  const startIndex = paths.indexOf('admin')
  const breadcrumbPaths = paths.slice(startIndex)

  return (
    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
      <Link href="/admin-area/admin" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="h-3 w-3" />
      </Link>
      
      {breadcrumbPaths.length > 1 && breadcrumbPaths.slice(1).map((path, index) => {
        const fullPath = `/${paths.slice(0, paths.indexOf(path) + 1).join('/')}`
        const isLast = index === breadcrumbPaths.length - 2
        const label = routeMap[path] || path

        // Don't show if it's a UUID (dynamic ID)
        const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path)
        if (isId) return null

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <Link 
              href={fullPath} 
              className={`hover:text-primary transition-colors ${isLast ? 'text-slate-900' : ''}`}
            >
              {label}
            </Link>
          </div>
        )
      })}
    </nav>
  )
}
