'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema, type AppointmentInput } from '@/schemas/appointment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  Clock, 
  Loader2,
  ShieldCheck 
} from 'lucide-react'
import { useState } from 'react'
import { createAppointment } from '@/server/appointments'
import { toast } from 'sonner'

interface ConfirmStepProps {
  tenantId: string
  selection: {
    serviceId: string
    serviceName: string
    practitionerId: string
    practitionerName: string
    date: string
    slot: string
  }
  onBack: () => void
  onComplete: (appointmentId: string) => void
}

export function ConfirmStep({
  tenantId,
  selection,
  onBack,
  onComplete
}: ConfirmStepProps) {
  const [isPending, setIsPending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      serviceId: selection.serviceId,
      practitionerId: selection.practitionerId,
      date: selection.date,
      slot: selection.slot,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: ''
    }
  })

  const onSubmit = async (data: AppointmentInput) => {
    setIsPending(true)
    try {
      const result = await createAppointment(tenantId, data)
      if (result.success && result.id) {
        toast.success("Rendez-vous confirmé !")
        onComplete(result.id)
      } else {
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Erreur lors de la confirmation")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Confirmez vos informations</h2>
        <div className="flex flex-col items-center gap-2">
           <p className="text-slate-500">Dernière étape avant la confirmation de votre soin.</p>
           <div className="px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Déjà patient ?</span>
              <a href="/login/patient" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Se connecter pour gagner du temps</a>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Reservation Summary */}
        <Card className="p-8 rounded-[2.5rem] bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden h-fit">
           <div className="absolute top-0 right-0 p-6 opacity-20 rotate-12">
              <ShieldCheck className="h-24 w-24" />
           </div>
           
           <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-bold border-b border-white/10 pb-4">Résumé du rendez-vous</h3>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                       <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</p>
                       <p className="font-bold">{selection.serviceName}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                       <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Praticien</p>
                       <p className="font-bold">{selection.practitionerName}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                       <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</p>
                       <p className="font-bold">{selection.date} à {selection.slot}</p>
                    </div>
                 </div>
              </div>
           </div>
        </Card>

        {/* Patient Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="font-bold ml-1">Prénom</Label>
                <Input 
                  {...register('firstName')} 
                  className={`h-12 rounded-xl focus:ring-primary/20 ${errors.firstName ? 'border-rose-500' : ''}`}
                  placeholder="Jean"
                />
                {errors.firstName && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.firstName.message}</p>}
             </div>
             <div className="space-y-2">
                <Label className="font-bold ml-1">Nom</Label>
                <Input 
                  {...register('lastName')} 
                  className={`h-12 rounded-xl focus:ring-primary/20 ${errors.lastName ? 'border-rose-500' : ''}`}
                  placeholder="Dupont"
                />
                {errors.lastName && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.lastName.message}</p>}
             </div>
          </div>

          <div className="space-y-2">
             <Label className="font-bold ml-1">Courriel</Label>
             <Input 
               {...register('email')} 
               type="email"
               className={`h-12 rounded-xl focus:ring-primary/20 ${errors.email ? 'border-rose-500' : ''}`}
               placeholder="jean.dupont@exemple.com"
             />
             {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
             <Label className="font-bold ml-1">Téléphone</Label>
             <Input 
               {...register('phone')} 
               type="tel"
               className={`h-12 rounded-xl focus:ring-primary/20 ${errors.phone ? 'border-rose-500' : ''}`}
               placeholder="(514) 000-0000"
             />
             {errors.phone && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
             <Label className="font-bold ml-1 text-slate-400 font-medium">Notes ou précisions (optionnel)</Label>
             <Textarea 
               {...register('notes')} 
               className="rounded-xl focus:ring-primary/20 min-h-[80px]"
               placeholder="Allergies, peur du dentiste, etc."
             />
          </div>

          <div className="flex justify-between pt-4 gap-4">
            <Button type="button" variant="ghost" onClick={onBack} disabled={isPending} className="font-bold">Retour</Button>
            <Button 
               type="submit"
               disabled={isPending}
               className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
            >
               {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmer le rendez-vous"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
