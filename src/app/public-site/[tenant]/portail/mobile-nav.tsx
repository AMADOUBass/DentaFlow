'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet'
import { 
  Menu, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  User as UserIcon, 
  LogOut 
} from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/server/auth'

interface PortalMobileNavProps {
  navItems: any[]
  tenantName: string
}

export function PortalMobileNav({ navItems, tenantName }: PortalMobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl lg:hidden">
          <Menu className="h-6 w-6 text-slate-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-none">
        <SheetHeader className="p-6 bg-slate-900 text-white text-left">
          <SheetTitle className="text-white font-black text-2xl flex items-center gap-2">
             <ShieldCheck className="h-6 w-6 text-primary" /> Oros
          </SheetTitle>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{tenantName}</p>
        </SheetHeader>
        
        <div className="flex flex-col h-full py-6">
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-14 rounded-2xl font-bold text-slate-600 hover:text-primary hover:bg-primary/5 gap-4"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="px-6 py-8 border-t">
            <form action={logout}>
               <Button variant="destructive" className="w-full h-14 rounded-2xl font-black gap-3 bg-rose-500 hover:bg-rose-600 border-none">
                  <LogOut className="h-5 w-5" /> Déconnexion
               </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
