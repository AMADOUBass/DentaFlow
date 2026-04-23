'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminAppointmentSchema, type AdminAppointmentInput } from '@/schemas/admin-appointment'
import { createAppointmentAdmin } from '@/server/admin-appointments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Calendar as CalendarIcon, User, Stethoscope, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Patient, Practitioner, Service, AppointmentStatus } from '@prisma/client'
import { format } from 'date-fns'

interface AppointmentFormProps {
  patients: Patient[]
  practitioners: Practitioner[]
  services: Service[]
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPatientId?: string
}

export function AppointmentForm({ patients, practitioners, services, open, onOpenChange, defaultPatientId }: AppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [wasSuccessful, setWasSuccessful] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<AdminAppointmentInput>({
    resolver: zodResolver(adminAppointmentSchema),
    defaultValues: {
      patientId: defaultPatientId || '',
      practitionerId: practitioners[0]?.id || '',
      serviceId: services[0]?.id || '',
      startsAt: new Date(),
      status: AppointmentStatus.CONFIRMED,
      notes: ''
    }
  })

  const onSubmit = async (data: AdminAppointmentInput) => {
    setIsLoading(true)
    try {
      const result = await createAppointmentAdmin(data)
      if (result.success) {
        setWasSuccessful(true)
        toast.success('Rendez-vous enregistré dans l\'agenda')
        reset()
        setTimeout(() => {
          setWasSuccessful(false)
          onOpenChange(false)
        }, 800)
      }
    } catch (error) {
      toast.error('Erreur lors de la création du rendez-vous')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-0 border-none overflow-hidden shadow-2xl">
        <div className="bg-primary p-8 text-white relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <DialogHeader className="relative z-10">
             <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
               <CalendarIcon className="h-6 w-6" /> Nouveau Rendez-vous
             </DialogTitle>
             <DialogDescription className="text-white/70 font-medium">
               Ajoutez manuellement un rendez-vous à l'agenda de la clinique.
             </DialogDescription>
           </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="p-8 space-y-6 bg-white">
          <div className="space-y-2">
            <Label className="font-bold flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /> Patient</Label>
            <Select onValueChange={(val) => setValue('patientId', val)}>
              <SelectTrigger className="rounded-xl h-11 border-slate-200">
                <SelectValue placeholder="Sélectionner un patient..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white max-h-[200px]">
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="rounded-xl cursor-pointer">
                    {p.lastName.toUpperCase()} {p.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patientId && <p className="text-[10px] text-rose-500 font-bold">{errors.patientId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-2"><Stethoscope className="h-4 w-4 text-slate-400" /> Praticien</Label>
              <Select onValueChange={(val) => setValue('practitionerId', val)}>
                <SelectTrigger className="rounded-xl h-11 border-slate-200">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
                  {practitioners.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="rounded-xl cursor-pointer">
                      {p.title} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /> Soin</Label>
              <Select onValueChange={(val) => setValue('serviceId', val)}>
                <SelectTrigger className="rounded-xl h-11 border-slate-200">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="rounded-xl cursor-pointer">
                      {s.name} ({s.durationMin} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Date et Heure</Label>
            <Input 
              type="datetime-local" 
              onChange={(e) => setValue('startsAt', new Date(e.target.value))}
              className="rounded-xl h-11 border-slate-200" 
            />
            {errors.startsAt && <p className="text-[10px] text-rose-500 font-bold">{errors.startsAt.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Notes / Observations</Label>
            <Textarea {...register('notes')} className="rounded-xl border-slate-200 resize-none" rows={2} />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Annuler</Button>
            <Button 
              type="submit" 
              disabled={isLoading || wasSuccessful} 
              className={`rounded-xl font-black min-w-[160px] h-12 shadow-xl uppercase tracking-widest text-[10px] transition-all ${
                wasSuccessful ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-primary hover:bg-slate-800'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : wasSuccessful ? (
                'Confirmé ✅'
              ) : (
                'Confirmer le RDV'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
