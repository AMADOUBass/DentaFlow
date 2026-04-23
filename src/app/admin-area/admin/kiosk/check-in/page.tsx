'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, User, Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { checkInPatientAction } from '@/server/kiosk'

export default function KioskCheckInPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ lastName: '', birthDate: '' })
  const [loading, setLoading] = useState(false)
  const [patientName, setPatientName] = useState('')

  const handleNext = async () => {
    setLoading(true)
    try {
      const result = await checkInPatientAction(formData.lastName, formData.birthDate)
      if (result.success) {
        setPatientName(result.patientName!)
        setStep(2)
      } else {
        toast.error("Nous n'avons pas trouvé de dossier à ce nom. Veuillez vous adresser à la réception.")
      }
    } catch (e) {
      toast.error("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = () => {
    // Envoyer la notification à la réception (via action serveur)
    router.push('/admin/kiosk')
  }

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-6 z-[101]">
      <div className="w-full max-w-2xl">
        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <Button variant="ghost" asChild className="rounded-full h-12 px-6 gap-2 text-slate-500 font-bold">
               <Link href="/admin-area/admin/kiosk"><ArrowLeft className="h-5 w-5" /> Retour</Link>
            </Button>

            <div className="space-y-2">
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Identifiez-vous</h2>
               <p className="text-lg text-slate-500 font-medium">Entrez vos informations pour confirmer votre présence.</p>
            </div>

            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden">
               <CardContent className="p-10 space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Nom de famille</label>
                    <div className="relative">
                      <User className="absolute left-6 top-5 h-6 w-6 text-slate-300" />
                      <Input 
                        placeholder="Ex: Tremblay" 
                        className="h-16 pl-16 rounded-2xl border-slate-100 bg-slate-50 text-xl font-bold focus:bg-white"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Date de naissance</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-5 h-6 w-6 text-slate-300" />
                      <Input 
                        type="date"
                        className="h-16 pl-16 rounded-2xl border-slate-100 bg-slate-50 text-xl font-bold focus:bg-white"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleNext}
                    disabled={!formData.lastName || !formData.birthDate || loading}
                    className="w-full h-20 rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-white font-black text-xl gap-3 shadow-xl"
                  >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Continuer"}
                  </Button>
               </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center space-y-10 animate-in zoom-in duration-500">
             <div className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                <CheckCircle2 className="h-16 w-16 text-white" />
             </div>
             <div className="space-y-4">
               <h2 className="text-5xl font-black text-slate-900 tracking-tight">Merci, {patientName} !</h2>
               <p className="text-xl text-slate-500 font-medium leading-relaxed">
                 Votre arrivée est confirmée. <br />
                 Veuillez vous asseoir en salle d'attente, <br />
                 votre praticien viendra vous chercher sous peu.
               </p>
             </div>
             <div className="pt-10">
               <Button 
                 onClick={handleFinish}
                 className="h-20 px-12 rounded-[1.5rem] bg-slate-900 text-white font-black text-xl shadow-xl"
               >
                 Terminer
               </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
