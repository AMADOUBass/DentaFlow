import { Stethoscope, Calendar, Phone, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PublicMobileNav } from '@/components/public/mobile-nav'
import { ConsentBanner } from '@/components/public/consent-banner'
import { Toaster } from 'sonner'
import Link from 'next/link'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const clinicName = tenant.charAt(0).toUpperCase() + tenant.slice(1)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary/20">
      {/* Clinical Header */}
      <header className="sticky top-0 z-50 w-full glass-morphism border-b">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
             <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95 shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                   <Stethoscope className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                   <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-none">
                      Centre {clinicName}
                   </span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Clinique Dentaire</span>
                </div>
             </Link>

             <nav className="hidden lg:flex items-center gap-8">
                <Link href="/" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Accueil</Link>
                <Link href="/services" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Services</Link>
                <Link href="/equipe" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Équipe</Link>
                <Link href="/contact" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Contact</Link>
                <Link href="/urgences" className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5">
                   <AlertTriangle className="h-3.5 w-3.5" /> Urgences
                </Link>
             </nav>

             <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden xl:flex flex-col items-end mr-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Besoin d'aide ?</span>
                   <span className="text-sm font-black text-slate-900">1-800-DENTIST</span>
                </div>
                <Link href="/rendez-vous" className="hidden sm:block">
                   <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 shadow-xl shadow-primary/20 group">
                      <Calendar className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> 
                      Rendez-vous
                   </Button>
                </Link>
                <PublicMobileNav clinicName={clinicName} />
             </div>
          </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Clinical Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2 grayscale opacity-50">
                 <Stethoscope className="h-4 w-4" />
                 <span className="text-xs font-black uppercase tracking-widest leading-none">Centre {clinicName}</span>
              </div>
              
              <div className="flex gap-8">
                 <Link href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Politique de confidentialité</Link>
                 <Link href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Loi 25 - Responsable</Link>
              </div>

              <p className="text-xs font-bold text-slate-300 italic">
                 Propulsé par <span className="text-primary not-italic">DentaFlow</span>
              </p>
           </div>
        </div>
      </footer>
      
      <ConsentBanner />
      <Toaster position="top-right" />
    </div>
  )
}
