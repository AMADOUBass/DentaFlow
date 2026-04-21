'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { practitionerSchema, type PractitionerInput } from '@/schemas/practitioner'
import { createPractitioner, updatePractitioner } from '@/server/practitioners'
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
import { Loader2, User, Camera } from 'lucide-react'
import { toast } from 'sonner'

import { Practitioner } from '@prisma/client'

interface PractitionerFormProps {
  practitioner?: Practitioner // If editing
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PractitionerForm({ practitioner, open, onOpenChange }: PractitionerFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PractitionerInput>({
    resolver: zodResolver(practitionerSchema),
    defaultValues: practitioner || {
      firstName: '',
      lastName: '',
      title: 'Dr',
      specialty: '',
      bio: '',
      photoUrl: '',
      active: true,
      color: '#0EA5E9'
    }
  })

  const onSubmit = async (data: PractitionerInput) => {
    setIsLoading(true)
    try {
      if (practitioner) {
        await updatePractitioner(practitioner.id, data)
        toast.success('Praticien mis à jour')
      } else {
        await createPractitioner(data)
        toast.success('Praticien créé')
        reset()
      }
      onOpenChange(false)
    } catch (error: unknown) {
      console.error('Practitioner form error:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            {practitioner ? 'Modifier le praticien' : 'Ajouter un praticien'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations médicales du membre de votre équipe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data: PractitionerInput) => onSubmit(data))} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-bold">Prénom</Label>
              <Input id="firstName" {...register('firstName')} className="rounded-xl" />
              {errors.firstName && <p className="text-[10px] text-red-500 font-bold">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-bold">Nom</Label>
              <Input id="lastName" {...register('lastName')} className="rounded-xl" />
              {errors.lastName && <p className="text-[10px] text-red-500 font-bold">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold">Titre</Label>
              <Input id="title" {...register('title')} placeholder="Dr, Dre, Hygiéniste" className="rounded-xl" />
              {errors.title && <p className="text-[10px] text-red-500 font-bold">{errors.title.message}</p>}
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="specialty" className="font-bold">Spécialité</Label>
              <Input id="specialty" {...register('specialty')} placeholder="Dentiste généraliste" className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl" className="font-bold">URL de la photo</Label>
            <div className="relative">
               <Camera className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
               <Input id="photoUrl" {...register('photoUrl')} placeholder="https://..." className="rounded-xl pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="font-bold">Biographie (Optionnelle)</Label>
            <Textarea id="bio" {...register('bio')} rows={3} className="rounded-xl resize-none" />
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="space-y-1 flex-1">
                <Label htmlFor="color" className="font-bold block">Couleur Agenda</Label>
                <p className="text-[10px] text-slate-500 font-medium">Sert à distinguer les rendez-vous dans le calendrier.</p>
             </div>
             <input type="color" {...register('color')} className="w-12 h-12 rounded-lg cursor-pointer border-none bg-transparent" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Annuler</Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl font-bold bg-primary shadow-lg shadow-primary/20 min-w-[120px]">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (practitioner ? 'Sauvegarder' : 'Créer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
