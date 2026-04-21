'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { usePathname } from 'next/navigation'
import { getTranslations, Locale } from '@/lib/i18n'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react'

// Schema de validation
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  email: z.string().email('Format de courriel invalide'),
  clinic: z.string().min(2, 'Le nom de la clinique est requis'),
  message: z.string().min(10, 'Le message est trop court (min. 10 caractères)'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
  const pathname = usePathname()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Détection de la langue
  const locale: Locale = pathname?.includes('/en') ? 'en' : 'fr'
  const t = getTranslations(locale)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      clinic: '',
      message: '',
    }
  })

  const handleFormSubmission = async (data: ContactFormValues) => {
    setSubmitError(null)
    setIsLoading(true)
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      console.error(error)
      setSubmitError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">{t.contact_page.title}</h1>
          <p className="text-xl text-slate-600 font-medium">{t.contact_page.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
          {/* Info Side */}
          <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
            {[
              { icon: <MapPin />, label: "Adresse", value: t.contact_page.info_address },
              { icon: <Phone />, label: "Téléphone", value: t.contact_page.info_phone },
              { icon: <Mail />, label: "Support", value: t.contact_page.info_support },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                  <p className="text-lg font-bold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl glass-card animate-in fade-in slide-in-from-right-8 duration-700">
            {isSubmitted ? (
               <div className="py-10 text-center space-y-6 animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                     <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{t.contact_page.success_title}</h3>
                  <Button 
                    variant="outline" 
                    className="rounded-xl px-10 border-slate-200 hover:bg-slate-50"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Retour
                  </Button>
               </div>
            ) : (
              <Form {...form}>
                <form 
                  noValidate
                  onSubmit={form.handleSubmit(handleFormSubmission, (errs) => console.error('Validation errors:', errs))}
                  className="space-y-6"
                >
                  <div className="space-y-4 text-left">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-slate-700">{t.contact_page.form_name}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Jean Dupont" 
                              {...field}
                              className="h-12 rounded-xl focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-slate-700">{t.contact_page.form_email}</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="jean@clinique.ca" 
                              {...field}
                              className="h-12 rounded-xl focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clinic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-slate-700">{t.contact_page.form_clinic}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ma Clinique" 
                              {...field}
                              className="h-12 rounded-xl focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-slate-700">{t.contact_page.form_message}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Message..." 
                              {...field}
                              className="min-h-[120px] rounded-xl focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-slate-200"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : t.contact_page.form_submit}
                    </Button>

                    {submitError && (
                      <p className="flex items-center gap-2 text-xs text-red-500 font-bold mt-4 animate-in slide-in-from-left-2">
                        <AlertCircle className="h-4 w-4" />{submitError}
                      </p>
                    )}

                    {Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted && (
                      <p className="text-center text-xs text-red-500 font-bold mt-4 animate-pulse">
                        Veuillez corriger les erreurs ci-dessus.
                      </p>
                    )}
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
