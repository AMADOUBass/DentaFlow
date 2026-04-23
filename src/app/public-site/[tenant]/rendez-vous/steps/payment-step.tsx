'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ShieldCheck, CreditCard, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface PaymentStepProps {
  amount: number
  onBack: () => void
  onPay: () => void
}

export function PaymentStep({ amount, onBack, onPay }: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePay = () => {
    setIsProcessing(true)
    // Simulate Stripe payment
    setTimeout(() => {
      setIsProcessing(false)
      onPay()
    }, 2000)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Garantie de réservation</h2>
        <p className="text-slate-500">Un acompte est requis pour confirmer votre premier rendez-vous.</p>
      </div>

      <Card className="p-10 rounded-[3rem] bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <CreditCard className="h-40 w-40" />
         </div>
         
         <div className="relative z-10 text-center space-y-8">
            <div className="space-y-2">
               <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Montant de l'acompte</p>
               <h3 className="text-6xl font-black tracking-tighter">{(amount / 100).toFixed(2)}$</h3>
               <p className="text-slate-400 text-sm">Ce montant sera déduit de votre facture finale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                     <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Paiement 100% Sécurisé</p>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                     <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Cryptage SSL 256-bit</p>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                     <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Visa / Mastercard / Amex</p>
               </div>
            </div>
         </div>
      </Card>

      <div className="flex flex-col gap-4">
         <Button 
            onClick={handlePay} 
            disabled={isProcessing}
            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
         >
            {isProcessing ? (
               <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Traitement sécurisé...</span>
               </div>
            ) : (
               <div className="flex items-center gap-3">
                  <span>Procéder au paiement</span>
                  <ArrowRight className="h-6 w-6" />
               </div>
            )}
         </Button>
         <Button variant="ghost" onClick={onBack} disabled={isProcessing} className="font-bold text-slate-400 hover:text-slate-600">
            Retour aux informations médicales
         </Button>
      </div>

      <p className="text-center text-[10px] text-slate-400 font-medium px-10">
         En procédant au paiement, vous acceptez nos conditions d'annulation. L'acompte est remboursable si annulé plus de 24h à l'avance.
      </p>
    </div>
  )
}
