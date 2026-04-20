'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientProfileSchema, type PatientProfileInput } from '@/schemas/patient'
import { updatePatientProfile } from '@/server/patients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Save, Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface ProfileFormProps {
  patient: any
  tenantId: string
}

export function ProfileForm({ patient, tenantId }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<PatientProfileInput>({
    resolver: zodResolver(patientProfileSchema) as any,
    defaultValues: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      phone: patient.phone,
      address: patient.address || '',
      insurancePolicy: patient.insurancePolicy || '',
      insuranceProviderId: patient.insuranceProviderId || null,
      smsOptIn: patient.smsOptIn,
    }
  })

  const onSubmit = async (data: PatientProfileInput) => {
    setIsLoading(true)
    try {
      await updatePatientProfile(tenantId, data)
      toast.success('Profil mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Personnal Info */}
        <Card className="border-none shadow-sm rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Informations Personnelles
            </CardTitle>
            <CardDescription>Vos coordonnées de base utilisées pour les rendez-vous.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div className="space-y-2">
               <Label htmlFor="email" className="font-bold">Courriel (non modifiable)</Label>
               <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="email" value={patient.email} disabled className="pl-10 rounded-xl bg-slate-50 border-none opacity-60" />
               </div>
            </div>
            <div className="space-y-2">
               <Label htmlFor="phone" className="font-bold">Téléphone</Label>
               <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="phone" {...register('phone')} className="pl-10 rounded-xl" />
               </div>
               {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Address & Insurance */}
        <Card className="border-none shadow-sm rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
               <MapPin className="h-5 w-5 text-primary" /> Adresse & Assurance
            </CardTitle>
            <CardDescription>Informations pour la facturation et les envois.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="address" className="font-bold">Adresse complète</Label>
               <Input id="address" {...register('address')} placeholder="123 rue de la Santé, Québec" className="rounded-xl" />
            </div>
            <div className="space-y-2 pt-2 border-t">
               <Label htmlFor="insurancePolicy" className="font-bold">Numéro de police d'assurance</Label>
               <Input id="insurancePolicy" {...register('insurancePolicy')} placeholder="P-XXXXXXX" className="rounded-xl" />
               <p className="text-[10px] text-slate-400 font-medium">Pour accélérer vos réclamations en clinique.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communications Preferences */}
      <Card className="border-none shadow-sm rounded-[2rem]">
         <CardContent className="p-8">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">Préférences de communication</h3>
                  <p className="text-sm text-slate-500">Accepter de recevoir les rappels et confirmations par SMS.</p>
               </div>
               <div className="flex items-center gap-2">
                  <input 
                     type="checkbox" 
                     id="smsOptIn" 
                     {...register('smsOptIn')} 
                     className="w-6 h-6 rounded-lg text-primary border-slate-200 focus:ring-primary"
                  />
                  <Label htmlFor="smsOptIn" className="font-bold text-sm cursor-pointer">Activer les rappels SMS</Label>
               </div>
            </div>
         </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
         <Button 
            type="submit" 
            disabled={isLoading}
            className="rounded-2xl h-14 px-10 font-black text-lg bg-primary shadow-xl shadow-primary/20 gap-3"
         >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Enregistrer les modifications
         </Button>
      </div>

      <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
         <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
         <div>
            <h4 className="font-bold text-emerald-900 text-sm">Protection des données (Loi 25)</h4>
            <p className="text-xs text-emerald-700 leading-relaxed mt-1">
               Vos données sont hébergées de manière sécurisée au Canada. Vous disposez d'un droit d'accès, de rectification et d'effacement de vos informations personnelles en contactant la clinique.
            </p>
         </div>
      </div>
    </form>
  )
}
