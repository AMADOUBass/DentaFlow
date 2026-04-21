'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, type ServiceInput } from '@/schemas/service'
import { createService, updateService } from '@/server/services'
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Loader2, Tag, Clock, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { Service, ServiceCategory } from '@prisma/client'

interface ServiceFormProps {
  service?: Service 
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceForm({ service, open, onOpenChange }: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service ? {
      ...service,
      priceCents: service.priceCents ? service.priceCents / 100 : null
    } : {
      name: '',
      nameEn: '',
      description: '',
      durationMin: 30,
      priceCents: null,
      category: 'PREVENTION',
      active: true,
      order: 0
    }
  })

  // Watch category handles for Select component
  const category = watch('category')

  const onSubmit = async (data: ServiceInput) => {
    setIsLoading(true)
    try {
      // Convert price back to cents
      const finalData = {
        ...data,
        priceCents: data.priceCents ? Math.round(Number(data.priceCents) * 100) : null,
        durationMin: Number(data.durationMin)
      }

      if (service) {
        await updateService(service.id, finalData)
        toast.success('Service mis à jour')
      } else {
        await createService(finalData)
        toast.success('Service créé')
        reset()
      }
      onOpenChange(false)
    } catch (error: unknown) {
      console.error('Service form error:', error)
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
            {service ? 'Modifier le service' : 'Nouveau service'}
          </DialogTitle>
          <DialogDescription>
            Configurez les détails du soin pour vos patients.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data: ServiceInput) => onSubmit(data))} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">Nom du soin (FR)</Label>
            <Input id="name" {...register('name')} placeholder="Ex: Nettoyage + Examen" className="rounded-xl" />
            {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-sm">Catégorie</Label>
              <Select 
                value={category} 
                onValueChange={(val) => setValue('category', val as ServiceCategory)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ServiceCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
               <Label htmlFor="durationMin" className="font-bold text-sm flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Durée (min)
               </Label>
               <Input 
                id="durationMin" 
                type="number" 
                {...register('durationMin', { valueAsNumber: true })} 
                className="rounded-xl" 
               />
               {errors.durationMin && <p className="text-[10px] text-red-500 font-bold">{errors.durationMin.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceCents" className="font-bold text-sm flex items-center gap-2">
               <DollarSign className="h-3 w-3" /> Prix estimatif ($)
            </Label>
            <Input 
              id="priceCents" 
              type="number" 
              step="0.01"
              {...register('priceCents')} 
              placeholder="0.00" 
              className="rounded-xl" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-bold text-sm">Description publique</Label>
            <Textarea 
              id="description" 
              {...register('description')} 
              placeholder="Décrivez brièvement le soin..." 
              rows={3} 
              className="rounded-xl resize-none" 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Annuler</Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl font-bold bg-primary shadow-lg shadow-primary/20 min-w-[120px]">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (service ? 'Sauvegarder' : 'Créer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
