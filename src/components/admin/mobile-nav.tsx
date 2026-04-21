'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
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
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/server/auth'
import { cn } from '@/lib/utils'

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
    { href: '/admin/practitioners', label: 'Praticiens', icon: Stethoscope },
    { href: '/admin/services', label: 'Services', icon: Activity },
    { href: '/admin/emergencies', label: 'Urgences', icon: AlertCircle },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-11 w-11 rounded-2xl bg-white border shadow-sm">
          <Menu className="h-6 w-6 text-slate-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[310px] p-0 border-none rounded-r-[3rem] shadow-2xl flex flex-col h-full overflow-hidden">
        <SheetHeader className="p-8 pb-4 text-left">
           <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-slate-50 overflow-hidden p-1.5">
                {logoUrl ? (
                  <Image src={logoUrl} alt={tenantName} width={44} height={44} className="object-contain" />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm">
                    {tenantName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                 <SheetTitle className="font-black text-xl tracking-tight text-slate-800 truncate">{tenantName}</SheetTitle>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Administration</span>
              </div>
           </div>
        </SheetHeader>

        <nav className="flex-1 px-6 space-y-1 pt-8 overflow-y-auto custom-scrollbar">
          {routes.map((route) => {
            const isActive = pathname === route.href || (route.href !== '/admin/dashboard' && pathname?.startsWith(route.href))
            return (
              <Link 
                key={route.href}
                href={route.href} 
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all transition-all duration-300",
                  isActive 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                )}
              >
                <route.icon className={cn("h-5 w-5", isActive ? "fill-white/10" : "")} />
                {route.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 bg-slate-50 border-t space-y-4">
           <div className="flex items-center gap-4 px-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-white shadow-md flex items-center justify-center text-white font-black">
                 {userName.charAt(0)}
              </div>
              <div className="min-w-0">
                 <p className="text-sm font-black text-slate-900 truncate">{userName}</p>
                 <p className="text-[10px] text-primary font-black uppercase tracking-widest">{userRole.replace('_', ' ')}</p>
              </div>
           </div>

          <Link 
            href="/admin/settings/security" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
          >
            <Lock className="h-5 w-5" />
            Sécurité (Loi 25)
          </Link>

          <Link 
            href="/admin/settings" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
          >
            <Settings className="h-5 w-5" />
            Configuration
          </Link>
          
          <form action={logout}>
            <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-100/50 w-full text-left transition-all">
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
