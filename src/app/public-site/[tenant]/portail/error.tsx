'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Portal error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center border-2 border-rose-100 mx-auto">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Erreur de chargement
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Impossible de charger votre espace patient. Veuillez réessayer ou vous reconnecter.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-400 bg-slate-100 rounded-lg px-3 py-2 inline-block">
              ID : {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Réessayer
          </Button>
          <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-2 gap-2" asChild>
            <Link href="/login/patient">
              <LogIn className="h-4 w-4" /> Se reconnecter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
