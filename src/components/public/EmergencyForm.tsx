'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emergencySchema, type EmergencyInput } from '@/schemas/emergency'
import { EmergencyCategory } from '@prisma/client'
import { submitEmergencyRequest } from '@/server/emergencies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface EmergencyFormProps {
  tenantId: string
  primaryColor: string
}

export function EmergencyForm({ tenantId, primaryColor }: EmergencyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EmergencyInput>({
    resolver: zodResolver(emergencySchema) as any,
    defaultValues: {
      painLevel: 5,
      category: EmergencyCategory.PAIN,
    }
  })

  const onSubmit = async (data: EmergencyInput) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await submitEmergencyRequest(tenantId, data)
      setIsSuccess(true)
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous appeler.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="rounded-full bg-teal-100 p-6">
            <CheckCircle2 className="h-16 w-16 text-teal-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Demande envoyée !</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Nous avons bien reçu votre demande d'urgence. Un membre de notre équipe vous contactera le plus rapidement possible.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <a href="/">Retour à l'accueil</a>
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-none shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: primaryColor }} />
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" {...register('firstName')} placeholder="Jean" />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" {...register('lastName')} placeholder="Tremblay" />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" {...register('phone')} placeholder="514-555-5555" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Courriel (optionnel)</Label>
              <Input id="email" {...register('email')} placeholder="jean@exemple.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Type d'urgence</Label>
              <Select onValueChange={(val) => setValue('category', val as EmergencyCategory)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmergencyCategory.PAIN}>Douleur intense</SelectItem>
                  <SelectItem value={EmergencyCategory.TRAUMA}>Traumatisme / Choc</SelectItem>
                  <SelectItem value={EmergencyCategory.INFECTION}>Infection / Abcès</SelectItem>
                  <SelectItem value={EmergencyCategory.BROKEN_TOOTH}>Dent cassée</SelectItem>
                  <SelectItem value={EmergencyCategory.LOST_FILLING}>Plombage perdu</SelectItem>
                  <SelectItem value={EmergencyCategory.OTHER}>Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="painLevel">Niveau de douleur (1-10)</Label>
              <Input id="painLevel" type="number" min="1" max="10" {...register('painLevel')} />
              {errors.painLevel && <p className="text-sm text-destructive">{errors.painLevel.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Décrivez votre problème</Label>
            <Textarea 
              id="description" 
              {...register('description')} 
              placeholder="Veuillez nous donner quelques détails..."
              className="resize-none h-32"
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-transform active:scale-[0.98]" 
            style={{ backgroundColor: primaryColor }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...
              </>
            ) : (
              "Envoyer la demande d'urgence"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
