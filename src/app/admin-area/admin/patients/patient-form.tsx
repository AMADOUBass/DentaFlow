'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminPatientSchema, type AdminPatientInput } from '@/schemas/patient'
import { createPatientAdmin, updatePatientAdminAction } from '@/server/patients'
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
import { Loader2, User, Mail, Phone, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'

interface PatientFormProps {
  patient?: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientForm({ patient, open, onOpenChange }: PatientFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [wasSuccessful, setWasSuccessful] = useState(false)
  const pathname = usePathname()
  
  const form = useForm<AdminPatientInput>({
    resolver: zodResolver(adminPatientSchema),
    defaultValues: patient ? {
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      address: patient.address || '',
      medicalNotes: patient.medicalNotes || '',
      smsOptIn: patient.smsOptIn ?? true
    } : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      medicalNotes: '',
      smsOptIn: true
    }
  })

  const onSubmit = async (data: AdminPatientInput) => {
    setIsLoading(true)
    try {
      let result;
      if (patient?.id) {
        result = await updatePatientAdminAction(patient.id, data)
      } else {
        result = await createPatientAdmin('', data)
      }
      
      if (result.success) {
        setWasSuccessful(true)
        toast.success(patient ? 'Dossier mis à jour' : 'Patient créé avec succès')
        
        setTimeout(() => {
          if (!patient) form.reset()
          setWasSuccessful(false)
          onOpenChange(false)
        }, 800)
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-0 border-none overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-8 text-white relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <DialogHeader className="relative z-10">
             <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
               <User className="h-6 w-6 text-primary" /> Nouveau Patient
             </DialogTitle>
             <DialogDescription className="text-slate-400 font-medium">
               Enregistrez un nouveau patient en toute sécurité (Conforme Loi 25).
             </DialogDescription>
           </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2 text-left">
              <Label className="font-bold text-slate-700 ml-1">Prénom</Label>
              <Input {...form.register('firstName')} className="rounded-xl border-slate-200 h-11" />
              {form.formState.errors.firstName && <p className="text-[10px] text-rose-500 font-black">{form.formState.errors.firstName.message}</p>}
            </div>
            <div className="space-y-2 text-left">
              <Label className="font-bold text-slate-700 ml-1">Nom</Label>
              <Input {...form.register('lastName')} className="rounded-xl border-slate-200 h-11" />
              {form.formState.errors.lastName && <p className="text-[10px] text-rose-500 font-black">{form.formState.errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2 text-left">
              <Label className="font-bold text-slate-700 ml-1">Courriel</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input {...form.register('email')} className="rounded-xl border-slate-200 h-11 pl-10" placeholder="patient@exemple.com" />
              </div>
              {form.formState.errors.email && <p className="text-[10px] text-rose-500 font-black">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2 text-left">
              <Label className="font-bold text-slate-700 ml-1">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input {...form.register('phone')} className="rounded-xl border-slate-200 h-11 pl-10" placeholder="514-000-0000" />
              </div>
              {form.formState.errors.phone && <p className="text-[10px] text-rose-500 font-black">{form.formState.errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2 text-left">
            <Label className="font-bold text-slate-700 ml-1">Note Médicale (Confidentiel)</Label>
            <Textarea 
              {...form.register('medicalNotes')} 
              placeholder="Allergies, conditions particulières..." 
              className="rounded-xl border-slate-200 resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <input 
               type="checkbox" 
               id="smsOptIn" 
               {...form.register('smsOptIn')} 
               className="h-5 w-5 rounded-lg border-slate-300 text-primary focus:ring-primary" 
             />
             <div className="space-y-0.5">
               <Label htmlFor="smsOptIn" className="font-bold text-slate-700 cursor-pointer text-xs">Autoriser les rappels par SMS</Label>
               <p className="text-[10px] text-slate-500 font-medium">Le patient recevra ses confirmations et rappels automatiquement.</p>
             </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
             <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
             <p className="text-[10px] font-bold text-emerald-800 leading-tight">
               Les données cliniques sont chiffrées de bout-en-bout et stockées exclusivement au Canada selon les normes de la Loi 25.
             </p>
          </div>

          <DialogFooter className="pt-4 flex !justify-between items-center gap-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Annuler</Button>
            <Button 
              type="submit" 
              disabled={isLoading || wasSuccessful} 
              className={`rounded-xl font-black min-w-[140px] h-12 shadow-xl uppercase tracking-widest text-[10px] transition-all ${
                wasSuccessful ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-primary hover:bg-slate-800 shadow-slate-200'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : wasSuccessful ? (
                 'Succès ✅'
              ) : (
                'Enregistrer le Patient'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
