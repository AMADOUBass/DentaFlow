'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, type ServiceInput } from '@/schemas/service'
import { createService, updateService } from '@/server/services'
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
  const [wasSuccessful, setWasSuccessful] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service ? {
      name: service.name,
      nameEn: service.nameEn || '',
      description: service.description || '',
      durationMin: service.durationMin,
      priceCents: service.priceCents || 0,
      category: service.category,
      active: service.active,
      order: service.order
    } : {
      name: '',
      nameEn: '',
      description: '',
      durationMin: 30,
      priceCents: 0,
      category: ServiceCategory.OTHER,
      active: true,
      order: 0
    }
  })

  const selectedCategory = watch('category')

  const onSubmit = async (data: ServiceInput) => {
    setIsLoading(true)
    try {
      if (service) {
        await updateService(service.id, data)
        toast.success('Service mis à jour avec succès')
      } else {
        await createService(data)
        toast.success('Nouveau service ajouté au catalogue')
        reset()
      }
      setWasSuccessful(true)
      setTimeout(() => {
        setWasSuccessful(false)
        onOpenChange(false)
      }, 800)
    } catch (error) {
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
            {service ? 'Modifier le soin' : 'Ajouter un nouveau soin'}
          </DialogTitle>
          <DialogDescription>
            Configurez les détails du soin pour votre catalogue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="font-bold">Nom du soin (Français)</Label>
            <Input {...register('name')} placeholder="Ex: Nettoyage complet" className="rounded-xl h-11" />
            {errors.name && <p className="text-[10px] text-rose-500 font-bold">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-2"><Tag className="h-3.5 w-3.5" /> Catégorie</Label>
              <Select 
                onValueChange={(val) => setValue('category', val as ServiceCategory)} 
                defaultValue={selectedCategory}
              >
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
                   {Object.values(ServiceCategory).map((cat) => (
                     <SelectItem key={cat} value={cat} className="rounded-xl font-medium cursor-pointer">
                        {cat}
                     </SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Durée (min)</Label>
              <Input type="number" {...register('durationMin', { valueAsNumber: true })} className="rounded-xl h-11" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold flex items-center gap-2"><DollarSign className="h-3.5 w-3.5" /> Prix Estimé ($)</Label>
            <Input 
               type="number" 
               step="0.01" 
               onChange={(e) => setValue('priceCents', Math.round(parseFloat(e.target.value) * 100))}
               defaultValue={service?.priceCents ? service.priceCents / 100 : 0}
               className="rounded-xl h-11" 
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Description courte</Label>
            <Textarea {...register('description')} rows={2} className="rounded-xl resize-none" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Annuler</Button>
            <Button 
              type="submit" 
              disabled={isLoading || wasSuccessful} 
              className={`rounded-xl font-black min-w-[120px] h-12 transition-all uppercase tracking-widest text-[10px] ${
                wasSuccessful ? 'bg-emerald-500 text-white' : 'bg-primary shadow-xl shadow-primary/20'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : wasSuccessful ? (
                'Succès ✅'
              ) : (
                service ? 'Sauvegarder' : 'Ajouter au catalogue'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
