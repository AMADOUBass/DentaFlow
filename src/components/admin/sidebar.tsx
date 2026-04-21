'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  MessageSquare, 
  Lock,
  Stethoscope,
  Activity,
  AlertCircle
} from 'lucide-react'
import { logout } from '@/server/auth'
import { cn } from '@/lib/utils'

interface SidebarProps {
  tenant: {
    name: string
    logoUrl?: string | null
  }
}

export function AdminSidebar({ tenant }: SidebarProps) {
  const pathname = usePathname()

  const mainRoutes = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/appointments', label: 'Rendez-vous', icon: Calendar },
    { href: '/admin/patients', label: 'Patients', icon: Users },
    { href: '/admin/practitioners', label: 'Praticiens', icon: Stethoscope },
    { href: '/admin/services', label: 'Services', icon: Activity },
    { href: '/admin/emergencies', label: 'Urgences', icon: AlertCircle },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  ]

  const settingsRoutes = [
    { href: '/admin/settings/security', label: 'Sécurité (Loi 25)', icon: Lock },
    { href: '/admin/settings', label: 'Configuration', icon: Settings },
  ]

  return (
    <aside className="w-72 bg-white border-r hidden md:flex flex-col sticky top-0 h-screen shadow-sm z-40">
      {/* Logo & Tenant Info */}
      <div className="p-8">
        <Link href="/admin/dashboard" className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-slate-50 overflow-hidden p-1.5 transition-transform group-hover:scale-105 group-hover:rotate-3">
             {tenant.logoUrl ? (
                <Image src={tenant.logoUrl} alt={tenant.name} width={44} height={44} className="object-contain" />
             ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm">
                   {tenant.name.charAt(0)}
                </div>
             )}
          </div>
          <div className="min-w-0">
             <span className="font-black text-base tracking-tight text-slate-800 block truncate group-hover:text-primary transition-colors">{tenant.name}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Administration</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1 pt-2 overflow-y-auto custom-scrollbar">
        {mainRoutes.map((route) => {
          const isActive = pathname === route.href || (route.href !== '/admin/dashboard' && pathname?.startsWith(route.href))
          
          return (
            <Link 
              key={route.href}
              href={route.href} 
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group",
                isActive ? "text-primary" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary/5 border border-primary/10 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <route.icon className={cn(
                "h-5 w-5 relative z-10 transition-transform group-hover:scale-110",
                isActive ? "text-primary fill-primary/10" : ""
              )} />
              <span className="relative z-10">{route.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-4 mt-auto border-t space-y-1">
        {settingsRoutes.map((route) => {
          const isActive = pathname === route.href || (route.href !== '/admin/settings' && pathname?.startsWith(route.href))
          return (
            <Link 
              key={route.href}
              href={route.href} 
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group",
                isActive ? "text-primary" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
               {isActive && (
                <motion.div
                  layoutId="active-pill-settings"
                  className="absolute inset-0 bg-primary/5 border border-primary/10 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <route.icon className={cn(
                "h-5 w-5 relative z-10 transition-transform group-hover:scale-110",
                isActive ? "text-primary fill-primary/10" : "opacity-70"
              )} />
              <span className="relative z-10">{route.label}</span>
            </Link>
          )
        })}

        <form action={logout}>
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 w-full text-left transition-all duration-300 group">
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
