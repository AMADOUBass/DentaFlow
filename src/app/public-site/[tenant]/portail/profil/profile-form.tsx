'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientProfileSchema, type PatientProfileInput } from '@/schemas/patient'
import { updatePatientProfile } from '@/server/patients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Save, Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { getTranslations, type Locale } from '@/lib/i18n'

import React from 'react'
import { Patient } from '@prisma/client'

interface ProfileFormProps {
  patient: Patient
  tenantSlug: string
  locale: Locale
}

export function ProfileForm({ patient, tenantSlug, locale }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const t = getTranslations(locale)
  const tp = t.patient_portal.profile

  const { register, handleSubmit, formState: { errors } } = useForm<PatientProfileInput>({
    resolver: zodResolver(patientProfileSchema),
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
      await updatePatientProfile(tenantSlug, data)
      toast.success(tp.success)
    } catch (error: unknown) {
      console.error('Update profile error:', error)
      toast.error(tp.error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit((data: PatientProfileInput) => onSubmit(data))} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Personnal Info */}
        <Card className="border-none shadow-sm rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> {tp.personal_info}
            </CardTitle>
            <CardDescription>{tp.personal_desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-bold">{tp.firstname}</Label>
                  <Input id="firstName" {...register('firstName')} className="rounded-xl" />
                  {errors.firstName && <p className="text-[10px] text-red-500 font-bold">{errors.firstName.message}</p>}
               </div>
               <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-bold">{tp.lastname}</Label>
                  <Input id="lastName" {...register('lastName')} className="rounded-xl" />
                  {errors.lastName && <p className="text-[10px] text-red-500 font-bold">{errors.lastName.message}</p>}
               </div>
            </div>
            <div className="space-y-2">
               <Label htmlFor="email" className="font-bold">{tp.email_readonly}</Label>
               <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="email" value={patient.email} disabled className="pl-10 rounded-xl bg-slate-50 border-none opacity-60" />
               </div>
            </div>
            <div className="space-y-2">
               <Label htmlFor="phone" className="font-bold">{tp.phone}</Label>
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
               <MapPin className="h-5 w-5 text-primary" /> {tp.address_insurance}
            </CardTitle>
            <CardDescription>{tp.address_desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="address" className="font-bold">{tp.address_label}</Label>
               <Input id="address" {...register('address')} placeholder={locale === 'fr' ? "123 rue de la Santé, Québec" : "123 Health St, Quebec"} className="rounded-xl" />
            </div>
            <div className="space-y-2 pt-2 border-t">
               <Label htmlFor="insurancePolicy" className="font-bold">{tp.insurance_label}</Label>
               <Input id="insurancePolicy" {...register('insurancePolicy')} placeholder="P-XXXXXXX" className="rounded-xl" />
               <p className="text-[10px] text-slate-400 font-medium">{tp.insurance_help}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communications Preferences */}
      <Card className="border-none shadow-sm rounded-[2rem]">
         <CardContent className="p-8">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">{tp.comm_prefs}</h3>
                  <p className="text-sm text-slate-500">{tp.comm_desc}</p>
               </div>
               <div className="flex items-center gap-2">
                  <input 
                     type="checkbox" 
                     id="smsOptIn" 
                     {...register('smsOptIn')} 
                     className="w-6 h-6 rounded-lg text-primary border-slate-200 focus:ring-primary"
                  />
                  <Label htmlFor="smsOptIn" className="font-bold text-sm cursor-pointer">{tp.sms_label}</Label>
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
            {tp.save}
         </Button>
      </div>

      <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
         <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
         <div>
            <h4 className="font-bold text-emerald-900 text-sm">{tp.data_protection}</h4>
            <p className="text-xs text-emerald-700 leading-relaxed mt-1">
               {tp.data_protection_desc}
            </p>
         </div>
      </div>
    </form>
  )
}
