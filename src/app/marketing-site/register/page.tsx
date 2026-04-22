'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clinicRegistrationSchema, ClinicRegistrationInput } from '@/schemas/registration'
import { registerClinicAction, checkSlugAvailability } from '@/server/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { 
  Loader2, 
  Building2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sparkles,
  Phone,
  MapPin
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const t = useTranslations('fr') // Default to fr for now
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const form = useForm<ClinicRegistrationInput>({
    resolver: zodResolver(clinicRegistrationSchema),
    defaultValues: {
      name: '',
      slug: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      adminName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched'
  })

  // Auto-generate slug from clinic name
  const clinicName = form.watch('name')
  useEffect(() => {
    if (step === 1 && clinicName && !form.getFieldState('slug').isDirty) {
      const generatedSlug = clinicName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      form.setValue('slug', generatedSlug)
    }
  }, [clinicName, step, form])

  // Check slug availability
  const slug = form.watch('slug')
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (slug && slug.length >= 3) {
      setIsCheckingSlug(true)
      timeoutId = setTimeout(async () => {
        const available = await checkSlugAvailability(slug)
        setIsSlugAvailable(available)
        setIsCheckingSlug(false)
      }, 500)
    } else {
      setIsSlugAvailable(null)
    }

    return () => clearTimeout(timeoutId)
  }, [slug])

  async function onSubmit(values: ClinicRegistrationInput) {
    if (step === 1) {
      // Validate step 1 fields
      const step1Fields = ['name', 'slug', 'phone', 'address', 'city', 'postalCode'] as const
      const isStep1Valid = await form.trigger(step1Fields)
      if (isStep1Valid && isSlugAvailable) {
        setStep(2)
      } else if (!isSlugAvailable) {
        toast.error("Ce sous-domaine n'est pas disponible.")
      }
      return
    }

    setIsSubmitting(true)
    const result = await registerClinicAction(values)

    if (result.error) {
      toast.error(result.error)
      setIsSubmitting(false)
    } else {
      setRegistrationSuccess(true)
      toast.success("Inscription réussie !")
      setIsSubmitting(false)
    }
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-lg border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white text-center p-12">
           <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
           </div>
           <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Vérifiez vos courriels !</h1>
           <p className="text-slate-500 font-medium mb-8 leading-relaxed">
             Un lien de confirmation a été envoyé à <strong>{form.getValues('email')}</strong>.<br/>
             Veuillez confirmer votre compte pour finaliser la création de votre clinique.
           </p>
           <I18nLink href="/login">
             <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black">Retour à la connexion</Button>
           </I18nLink>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-stretch bg-slate-50 selection:bg-primary/20 overflow-hidden">
      {/* Visual Panel */}
      <div className="hidden lg:flex lg:w-1/3 relative bg-slate-900 overflow-hidden p-16 flex-col justify-between">
         <div className="absolute inset-0 mesh-gradient opacity-20"></div>
         
         <I18nLink href="/" className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">DF</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">Oros</span>
         </I18nLink>

         <div className="relative z-10 space-y-12">
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-white leading-tight">
                  Rejoignez le futur de la <span className="text-primary italic">gestion dentaire.</span>
               </h2>
               <p className="text-slate-400 font-medium text-lg leading-relaxed">
                  Créez votre espace clinique en moins de 2 minutes et commencez à transformer votre pratique.
               </p>
            </div>

            <div className="space-y-8">
               <div className={`flex items-center gap-4 transition-all duration-500 ${step === 1 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${step === 1 ? 'bg-primary text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>1</div>
                  <div className="text-white font-bold">Ma Clinique</div>
               </div>
               <div className={`flex items-center gap-4 transition-all duration-500 ${step === 2 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${step === 2 ? 'bg-primary text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>2</div>
                  <div className="text-white font-bold">Mon Compte Admin</div>
               </div>
            </div>
         </div>

         <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
               "Oros a simplifié toute notre gestion Loi 25. C'est un gain de temps incroyable pour notre équipe."
            </p>
            <p className="text-[10px] text-primary font-black mt-2 uppercase tracking-widest">— Dr. Marc-Antoine Roy</p>
         </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-8 relative scrollbar-hide overflow-y-auto">
         <div className="w-full max-w-2xl">
            <div className="mb-10 text-center lg:text-left flex flex-col items-center lg:items-start gap-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider mb-2">
                  <Sparkles className="h-3 w-3" /> Inscription Clinique
               </div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {step === 1 ? "Parlez-nous de votre clinique" : "Créez votre accès administrateur"}
               </h1>
               <p className="text-slate-500 font-medium tracking-tight">
                  {step === 1 ? "Ces informations serviront à personnaliser votre espace de travail." : "Ce compte sera le propriétaire principal de la plateforme."}
               </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-slate-700 font-bold ml-1">Nom de la clinique</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                              <Input placeholder="Clinique Dentaire Orizon" className="pl-11 h-12 rounded-2xl" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-slate-700 font-bold ml-1">Votre sous-domaine</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                              <Input placeholder="clinique-odontos" className="pl-11 pr-24 h-12 rounded-2xl" {...field} />
                              <div className="absolute right-4 top-3 h-6 flex items-center gap-2">
                                 {isCheckingSlug ? (
                                   <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                 ) : isSlugAvailable === true ? (
                                   <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                 ) : isSlugAvailable === false ? (
                                   <AlertCircle className="h-4 w-4 text-rose-500" />
                                 ) : null}
                                 <span className="text-[10px] font-black text-slate-400">.oros.ca</span>
                              </div>
                            </div>
                          </FormControl>
                          <p className="text-[10px] text-slate-400 font-medium italic mt-1 ml-1">L'URL d'accès à votre plateforme (lettres, chiffres et tirets uniquement).</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="neq"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel className="text-slate-700 font-bold ml-1">NEQ (Numéro d'entreprise)</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" className="h-12 rounded-2xl" {...field} />
                          </FormControl>
                          <p className="text-[10px] text-slate-400 font-medium italic mt-1 ml-1">Numéro à 10 chiffres pour vérification légale.</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel className="text-slate-700 font-bold ml-1">Téléphone</FormLabel>
                          <FormControl>
                            <div className="relative">
                               <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                               <Input placeholder="514 555-0123" className="pl-11 h-12 rounded-2xl" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-bold ml-1">Code Postal</FormLabel>
                          <FormControl>
                            <Input placeholder="H3G 1Z1" className="h-12 rounded-2xl uppercase" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel className="text-slate-700 font-bold ml-1">Adresse</FormLabel>
                          <FormControl>
                            <div className="relative">
                               <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                               <Input placeholder="123 rue de la Montagne" className="pl-11 h-12 rounded-2xl" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel className="text-slate-700 font-bold ml-1">Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Montréal" className="h-12 rounded-2xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="adminName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-bold ml-1">Nom complet</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                              <Input placeholder="Dr. Amadou Bass" className="pl-11 h-12 rounded-2xl" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-bold ml-1">Courriel professionnel</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                              <Input placeholder="dr.bass@clinique.ca" className="pl-11 h-12 rounded-2xl" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-bold ml-1">Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                <Input type="password" className="pl-11 h-12 rounded-2xl" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-bold ml-1">Confirmation</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                <Input type="password" className="pl-11 h-12 rounded-2xl" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                  {step === 2 && (
                    <Button 
                      type="button" 
                      variant="outline"
                      className="h-14 px-8 rounded-2xl font-bold order-2 sm:order-1"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="flex-1 h-14 rounded-2xl font-black text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all active:scale-[0.98] order-1 sm:order-2" 
                    disabled={isSubmitting || (step === 1 && isSlugAvailable === false)}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Inscription en cours...
                      </>
                    ) : step === 1 ? (
                      <>
                        Continuer <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Créer mon espace <Sparkles className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-sm text-slate-400 font-medium">
                  Déjà un compte ? <I18nLink href="/login" className="text-primary font-black hover:underline">Se connecter</I18nLink>
                </p>
              </form>
            </Form>
         </div>
      </div>
    </div>
  )
}
