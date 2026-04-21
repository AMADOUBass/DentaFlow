'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, LayoutDashboard, Calendar, Users, Settings, LogOut, MessageSquare, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { logout } from '@/server/auth'

interface MobileNavProps {
  tenantName: string
  userName: string
  userRole: string
  logoUrl?: string | null
}

export function MobileNav({ tenantName, userName, userRole, logoUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/appointments', label: 'Rendez-vous', icon: Calendar },
    { href: '/admin/patients', label: 'Patients', icon: Users },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6 text-slate-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 border-none rounded-r-[2.5rem] shadow-2xl">
        <SheetHeader className="p-8 pb-4 text-left">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border overflow-hidden p-1.5">
                {logoUrl ? (
                  <Image src={logoUrl} alt={tenantName} width={40} height={40} className="object-contain" />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm">
                    {tenantName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                 <SheetTitle className="font-black text-lg tracking-tight text-slate-800 truncate">{tenantName}</SheetTitle>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administration</span>
              </div>
           </div>
        </SheetHeader>

        <nav className="flex-1 px-6 space-y-1.5 pt-6">
          {routes.map((route) => {
            const isActive = pathname === route.href
            return (
              <Link 
                key={route.href}
                href={route.href} 
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
          <Link 
            href="/admin/settings/security" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <Lock className="h-5 w-5" />
            Sécurité (Loi 25)
          </Link>

          <Link 
            href="/admin/settings" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <Settings className="h-5 w-5" />
            Configuration
          </Link>
          
          <form action={logout}>
            <button className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 w-full text-left transition-colors">
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
