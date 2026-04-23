'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Home, Sparkles, Layout, DollarSign, Phone, LogIn, CalendarCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface MarketingMobileNavProps {
  t: any
}

export function MarketingMobileNav({ t }: MarketingMobileNavProps) {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: t.nav.features, icon: Home },
    { href: '/solutions', label: t.nav.solutions, icon: Layout },
    { href: '/pricing', label: t.nav.pricing, icon: DollarSign },
    { href: '/contact', label: t.nav.contact, icon: Phone },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6 text-slate-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] p-0 border-none rounded-l-[2.5rem] shadow-2xl">
        <SheetHeader className="p-8 pb-4 text-left">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border overflow-hidden p-1.5 grayscale-0">
                <Image src="/icon.png" alt="Oros" width={40} height={40} className="object-contain" />
              </div>
              <div className="min-w-0">
                 <SheetTitle className="font-black text-xl tracking-tighter text-slate-900">Oros</SheetTitle>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                    <Sparkles className="h-2 w-2 fill-primary" /> Management
                 </span>
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
          
          <Separator className="my-4 bg-slate-100" />
          
          <Link 
            href="/login" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all active:scale-95"
          >
            <LogIn className="h-5 w-5 opacity-70" />
            {t.common.login}
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
           <Link href="/login" onClick={() => setOpen(false)}>
              <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 gap-2">
                 <CalendarCheck className="h-5 w-5" />
                 {t.common.demo}
              </Button>
           </Link>
           <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
              © 2026 Oros Platform
           </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
