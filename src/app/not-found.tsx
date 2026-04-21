import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-flex">
           <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center border-2 border-primary/20 rotate-3 group hover:rotate-0 transition-transform">
              <Stethoscope className="h-12 w-12 text-primary" />
           </div>
           <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Erreur 404
           </div>
        </div>

        <div className="space-y-4">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Oups ! Page introuvable</h1>
           <p className="text-slate-500 font-medium leading-relaxed">
              Il semble que vous vous soyez égaré dans nos dossiers. <br />
              Cette page n'existe pas ou a été déplacée vers un autre cabinet.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2 hover:bg-slate-100 gap-2" asChild>
              <Link href="javascript:history.back()">
                 <ArrowLeft className="h-4 w-4" /> Retour
              </Link>
           </Button>
           <Button className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-200 gap-2" asChild>
              <Link href="/">
                 <Home className="h-4 w-4" /> Accueil
              </Link>
           </Button>
        </div>

        <div className="pt-12">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
               SÉCURISÉ PAR DENTAFLOW SYSTEMS INC.
            </p>
        </div>
      </div>
    </div>
  )
}
