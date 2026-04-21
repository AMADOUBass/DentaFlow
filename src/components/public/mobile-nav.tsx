'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Home, Stethoscope, Users, Phone, AlertTriangle, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface PublicMobileNavProps {
  clinicName: string
}

export function PublicMobileNav({ clinicName }: PublicMobileNavProps) {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/services', label: 'Services', icon: Stethoscope },
    { href: '/equipe', label: 'Notre Équipe', icon: Users },
    { href: '/contact', label: 'Contact', icon: Phone },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6 text-slate-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] p-0 border-none rounded-l-[2.5rem] shadow-2xl">
        <SheetHeader className="p-8 pb-4 text-left">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border overflow-hidden p-1.5">
                <Image src="/icon.png" alt="DentaFlow" width={40} height={40} className="object-contain" />
              </div>
              <div className="min-w-0">
                 <SheetTitle className="font-black text-lg tracking-tight text-slate-800 truncate">Centre {clinicName}</SheetTitle>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Clinique Dentaire</span>
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
            href="/urgences" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
          >
            <AlertTriangle className="h-5 w-5" />
            Urgences
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
           <Link href="/rendez-vous" onClick={() => setOpen(false)}>
              <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 gap-2">
                 <Calendar className="h-5 w-5" />
                 Rendez-vous
              </Button>
           </Link>
           <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
              © 2026 DentaFlow
           </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
