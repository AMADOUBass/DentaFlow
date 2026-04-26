'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tenantSettingsSchema, type TenantSettingsInput } from '@/schemas/tenant'
import { updateTenantAction } from '@/server/tenant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Save, Building2, Globe, Mail, Phone, MapPin, Palette } from 'lucide-react'
import { isNextRedirect } from '@/lib/action-utils'

interface GeneralFormProps {
  initialData: any
}

export function GeneralForm({ initialData }: GeneralFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [wasSuccessful, setWasSuccessful] = useState(false)
  const router = useRouter()

  const form = useForm<TenantSettingsInput>({
    resolver: zodResolver(tenantSettingsSchema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      address: initialData.address || '',
      city: initialData.city || '',
      postalCode: initialData.postalCode || '',
      province: initialData.province || 'QC',
      logoUrl: initialData.logoUrl || '',
      primaryColor: initialData.primaryColor || '#0F766E',
      bilingual: initialData.bilingual ?? true,
    }
  })

  const onSubmit = async (values: TenantSettingsInput) => {
    setIsLoading(true)
    try {
      const result = await updateTenantAction(values)
      if (result.success) {
        setWasSuccessful(true)
        toast.success("Paramètres mis à jour")
        
        setTimeout(() => {
          router.push('/admin/settings')
        }, 800)
      } else {
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch (error) {
      if (isNextRedirect(error)) throw error
      toast.error("Une erreur inattendue est survenue. Vos modifications n'ont peut-être pas été enregistrées.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Section Identité */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Identité de la Clinique</h3>
           </div>
           <Card className="border-none shadow-sm rounded-3xl p-6 bg-white border border-slate-100">
              <CardContent className="p-0 space-y-5">
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Nom de la clinique</Label>
                    <Input {...form.register('name')} placeholder="Ex: Centre Dentaire XYZ" className="rounded-xl border-slate-200 h-11 font-medium" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">URL du Logo (Direct URL)</Label>
                    <Input {...form.register('logoUrl')} placeholder="https://..." className="rounded-xl border-slate-200 h-11 font-medium" />
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Section Contact */}
        <div className="space-y-4 lg:col-span-2">
           <div className="flex items-center gap-3 ml-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Coordonnées & Localisation</h3>
           </div>
           <Card className="border-none shadow-sm rounded-3xl p-8 bg-white border border-slate-100">
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                       <Mail className="h-3 w-3" /> Courriel de contact
                    </Label>
                    <Input {...form.register('email')} className="rounded-xl border-slate-200 h-11" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                       <Phone className="h-3 w-3" /> Téléphone
                    </Label>
                    <Input {...form.register('phone')} placeholder="514-000-0000" className="rounded-xl border-slate-200 h-11" />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                       <MapPin className="h-3 w-3" /> Adresse civique
                    </Label>
                    <Input {...form.register('address')} className="rounded-xl border-slate-200 h-11" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Ville</Label>
                    <Input {...form.register('city')} className="rounded-xl border-slate-200 h-11" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Code Postal</Label>
                    <Input {...form.register('postalCode')} className="rounded-xl border-slate-200 h-11" placeholder="H1X 1X1" />
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Branding & Design */}
        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Branding</h3>
           </div>
           <Card className="border-none shadow-sm rounded-3xl p-6 bg-white border border-slate-100">
              <CardContent className="p-0 space-y-5">
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">Couleur Primaire</Label>
                    <div className="flex gap-3 items-center">
                       <div 
                         className="w-11 h-11 rounded-xl border" 
                         style={{ backgroundColor: form.watch('primaryColor') }}
                       ></div>
                       <Input 
                         {...form.register('primaryColor')} 
                         className="rounded-xl border-slate-200 h-11 flex-1 font-mono uppercase" 
                       />
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Support Bilingue</span>
                    <input 
                      type="checkbox" 
                      {...form.register('bilingual')} 
                      className="w-5 h-5 accent-primary"
                    />
                 </div>
              </CardContent>
           </Card>
        </div>

      </div>

      <div className="fixed bottom-10 right-10 z-50">
        <Button 
          type="submit" 
          disabled={isLoading || wasSuccessful}
          className={`h-16 px-10 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all group ${
            wasSuccessful ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-primary'
          } ${!wasSuccessful && 'hover:scale-105'}`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : wasSuccessful ? (
            <>
               <Save className="mr-2 h-5 w-5" />
               Succès ✅
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5 group-hover:-rotate-12 transition-transform" /> 
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
