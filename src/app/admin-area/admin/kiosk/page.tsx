import { Monitor, UserCheck, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function KioskWelcomePage() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center z-[100]">
      <div className="absolute top-10 flex items-center gap-2">
         <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
           Borne d'accueil sécurisée
         </span>
      </div>

      <div className="space-y-8 max-w-lg">
        <div className="w-32 h-32 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 animate-bounce">
           <Monitor className="h-16 w-16 text-white" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tight">Bienvenue.</h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Veuillez utiliser cette borne pour confirmer votre arrivée et mettre à jour votre dossier.
          </p>
        </div>

        <div className="pt-10">
          <Button asChild className="w-full h-24 rounded-[2rem] bg-white hover:bg-slate-100 text-slate-900 font-black text-2xl gap-4 shadow-2xl shadow-white/10">
            <Link href="/admin/kiosk/check-in">
              <UserCheck className="h-8 w-8 text-primary" />
              Commencer mon Check-in
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-10 flex items-center gap-3 text-slate-500">
         <ShieldCheck className="h-5 w-5" />
         <span className="text-xs font-bold uppercase tracking-widest">Protection des renseignements personnels (Loi 25)</span>
      </div>
    </div>
  )
}
