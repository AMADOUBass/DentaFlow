'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emergencySchema, type EmergencyInput } from '@/schemas/emergency'
import { submitEmergencyRequest } from '@/server/emergencies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { EmergencyCategory } from '@prisma/client'
import { Calendar, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface EmergencyFormProps {
  tenantId: string
}

export function EmergencyForm({ tenantId }: EmergencyFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<EmergencyInput>({
    resolver: zodResolver(emergencySchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      description: '',
      painLevel: 5,
      category: EmergencyCategory.PAIN
    }
  })

  const onSubmit: SubmitHandler<EmergencyInput> = async (data) => {
    setIsPending(true)
    try {
      const result = await submitEmergencyRequest(tenantId, data)
      if (result.success) {
        setIsSuccess(true)
        toast.success("Demande d'urgence envoyée avec succès")
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi")
    } finally {
      setIsPending(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-100">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Demande Reçue</h2>
          <p className="text-slate-600 font-medium max-w-sm">
            Notre équipe a été alertée. Nous vous contacterons par téléphone dans les plus brefs délais.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsSuccess(false)}
          className="rounded-xl font-bold"
        >
          Envoyer un autre signalement
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bold ml-1">Prénom</Label>
          <Input 
            {...register('firstName')}
            className={`h-12 rounded-xl bg-white/50 ${errors.firstName ? 'border-rose-500' : ''}`} 
            placeholder="Jean" 
          />
          {errors.firstName && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="font-bold ml-1">Nom</Label>
          <Input 
            {...register('lastName')}
            className={`h-12 rounded-xl bg-white/50 ${errors.lastName ? 'border-rose-500' : ''}`} 
            placeholder="Dupont" 
          />
          {errors.lastName && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bold ml-1">Téléphone</Label>
          <Input 
            {...register('phone')}
            className={`h-12 rounded-xl bg-white/50 ${errors.phone ? 'border-rose-500' : ''}`} 
            placeholder="(514) 000-0000" 
            type="tel" 
          />
          {errors.phone && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="font-bold ml-1">Courriel (optionnel)</Label>
          <Input 
            {...register('email')}
            className={`h-12 rounded-xl bg-white/50 ${errors.email ? 'border-rose-500' : ''}`} 
            placeholder="jean.dupont@exemple.com" 
            type="email" 
          />
          {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-bold ml-1">Type d'urgence</Label>
          <Select onValueChange={(v) => setValue('category', v as EmergencyCategory)}>
            <SelectTrigger className="h-12 rounded-xl bg-white/50">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EmergencyCategory.PAIN}>Douleur intense</SelectItem>
              <SelectItem value={EmergencyCategory.TRAUMA}>Accident / Choc</SelectItem>
              <SelectItem value={EmergencyCategory.INFECTION}>Infection / Abcès</SelectItem>
              <SelectItem value={EmergencyCategory.BROKEN_TOOTH}>Dent cassée</SelectItem>
              <SelectItem value={EmergencyCategory.LOST_FILLING}>Plombage perdu</SelectItem>
              <SelectItem value={EmergencyCategory.OTHER}>Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-bold ml-1">Niveau de douleur (1-10)</Label>
          <Select onValueChange={(v) => setValue('painLevel', parseInt(v))}>
            <SelectTrigger className="h-12 rounded-xl bg-white/50">
              <SelectValue placeholder="Indiquez..." />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <SelectItem key={i} value={i.toString()}>{i} - {i <= 3 ? 'Faible' : i <= 7 ? 'Modérée' : 'Extrême'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-bold ml-1">Description</Label>
        <Textarea 
          {...register('description')}
          className={`rounded-xl bg-white/50 min-h-[100px] ${errors.description ? 'border-rose-500' : ''}`} 
          placeholder="Décrivez votre situation brièvement..." 
        />
        {errors.description && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.description.message}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-xl shadow-rose-200 active:scale-[0.98] transition-all disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>Envoyer le signalement <Calendar className="ml-2 h-5 w-5" /></>
        )}
      </Button>
    </form>
  )
}
