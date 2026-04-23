'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, ShieldCheck, LayoutDashboard, Building2, FileText, LogOut } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/server/auth'

export function SuperAdminMobileNav() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin-area/superadmin/tenants', label: 'Cliniques', icon: Building2 },
    { href: '/admin-area/superadmin/logs', label: "Logs d'Audit", icon: FileText },
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
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                 <SheetTitle className="font-black text-xl tracking-tighter text-slate-900">Oros Console</SheetTitle>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Administration Matrix</span>
              </div>
           </div>
        </SheetHeader>

        <nav className="flex-1 px-6 space-y-1 pt-6">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all active:scale-95"
            >
              <link.icon className="h-5 w-5 opacity-70" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
           <form action={logout}>
              <Button variant="ghost" className="w-full h-14 rounded-2xl text-rose-600 font-bold gap-2 hover:bg-rose-50 transition-colors">
                 <LogOut className="h-5 w-5" />
                 Déconnexion
              </Button>
           </form>
           <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-6">
              Oros v1.0.0
           </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
