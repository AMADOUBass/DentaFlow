'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function TenantError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Tenant layout error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center border-2 border-rose-100 mx-auto">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Service indisponible</h1>
          <p className="text-slate-500 font-medium">
            Impossible de charger les données de la clinique. Veuillez réessayer dans quelques instants.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-400 bg-slate-100 rounded-lg px-3 py-2 inline-block">
              ID : {error.digest}
            </p>
          )}
        </div>
        <Button
          onClick={() => reset()}
          className="h-12 px-8 rounded-xl bg-primary text-white font-black shadow-xl shadow-primary/20 gap-2"
        >
          <RefreshCcw className="h-4 w-4" /> Réessayer
        </Button>
      </div>
    </div>
  )
}
