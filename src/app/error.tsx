'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log l'erreur vers un service de monitoring (Sentry, etc.)
    console.error('Global Error Boundary:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-flex">
           <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center border-2 border-rose-100 rotate-3 group hover:rotate-0 transition-transform">
              <AlertCircle className="h-12 w-12 text-rose-500" />
           </div>
           <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Système
           </div>
        </div>

        <div className="space-y-4">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Une erreur est survenue</h1>
           <p className="text-slate-500 font-medium leading-relaxed">
              Désolé, une anomalie technique est survenue sur le serveur. <br />
              Nos techniciens ont été notifiés de la situation.
           </p>
        </div>

        {error.digest && (
          <div className="p-3 bg-slate-100 rounded-xl">
             <p className="text-[10px] font-mono text-slate-400">ID Erreur : {error.digest}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <Button 
             onClick={() => reset()}
             className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 gap-2"
           >
              <RefreshCcw className="h-4 w-4" /> Réessayer
           </Button>
           <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2 hover:bg-slate-100 gap-2" asChild>
              <Link href="/">
                 <Home className="h-4 w-4" /> Accueil
              </Link>
           </Button>
        </div>

        <div className="pt-12">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
               Oros SYSTEMS INC. — ÉTAT DU RÉSEAU : ACTIF
            </p>
        </div>
      </div>
    </div>
  )
}
