'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@/server/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslations, Locale } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'
import { loginSchema, LoginInput } from '@/schemas/auth'

export default function LoginPage() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' as Locale : 'fr' as Locale
  const t = useTranslations(locale)
  
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Initialisation du formulaire avec RHF + Zod
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched'
  })

  async function onSubmit(values: LoginInput) {
    setIsLoading(true)
    setServerError(null)

    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)
      
      const result = await login(formData)

      if (result?.error) {
        setServerError(result.error)
        setIsLoading(false)
      }
      // If no error, the server action will redirect the page
    } catch (error: any) {
      // Check if it's a Next.js redirect error (sometimes caught on client)
      if (error?.message === 'NEXT_REDIRECT') {
        return;
      }
      
      console.error("Login client error:", error)
      setServerError("Une erreur est survenue. Vérifiez vos identifiants.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-slate-50 selection:bg-primary/20 overflow-hidden">
      {/* LEFT PANEL - Marketing & Visuals (Visible on MD+) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden p-20 flex-col justify-between">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

         

         <div className="relative z-10 space-y-10">
            <h2 className="text-5xl font-black text-white leading-tight animate-in fade-in slide-in-from-left-4 duration-700">
               {t.login_page.headline_part1} <br />
               <span className="text-primary underline decoration-white/10 underline-offset-8">{t.login_page.headline_accent}</span>
               {t.login_page.headline_part2}
            </h2>
            
            <div className="space-y-6">
                {[
                  { text: t.login_page.feature_law25, soon: false },
                  { text: t.login_page.feature_ai, soon: true },
                  { text: t.login_page.feature_ui, soon: false }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 text-white/80 animate-in fade-in slide-in-from-left-8 stagger-${i+1}`}>
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.text}</span>
                        {item.soon && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] px-2 py-0 h-4 font-black uppercase tracking-tighter">
                            {t.common.soon.split(' ')[0]}
                          </Badge>
                        )}
                      </div>
                  </div>
                ))}
            </div>
         </div>

         <div className="relative z-10 p-8 glass-morphism rounded-3xl border-white/10 animate-in fade-in zoom-in duration-1000">
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-primary/40 bg-slate-800 shrink-0"></div>
               <div>
                  <p className="text-white font-bold italic">"{t.login_page.testimonial}"</p>
                  <p className="text-slate-400 text-sm mt-2">— Dr. Jean Dupont, Clinique Dentaire Vision</p>
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
         <div className="absolute inset-0 mesh-gradient opacity-40 lg:hidden"></div>
         
         <div className="absolute top-8 left-8 lg:hidden">
             {/* Logo/Texte retiré */}
          </div>

         <Card className="w-full max-w-md border-none shadow-none bg-transparent lg:p-4 relative z-10">
            <div className="space-y-2 mb-10 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider mb-2">
                   {t.login_page.secure_space}
               </div>
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t.login_page.portal_title}</h1>
               <p className="text-slate-500 font-medium tracking-tight">{t.login_page.portal_desc}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-slate-700 font-bold ml-1">{t.login_page.email_label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                             <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                             <Input 
                                placeholder="nom@clinique.ca" 
                                className="pl-11 h-12 rounded-2xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm focus:ring-primary/20" 
                                {...field}
                             />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-bold pl-1" />
                      </FormItem>
                    )}
                 />
                 
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                          <FormLabel className="text-slate-700 font-bold">{t.login_page.password_label}</FormLabel>
                          <I18nLink href="#" className="text-xs font-bold text-primary hover:underline">{t.login_page.forgot_password}</I18nLink>
                        </div>
                        <FormControl>
                          <div className="relative">
                             <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                             <Input 
                                type="password" 
                                className="pl-11 h-12 rounded-2xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm focus:ring-primary/20" 
                                {...field}
                             />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-bold pl-1" />
                      </FormItem>
                    )}
                 />

                 {serverError && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold animate-in fade-in zoom-in duration-300 flex items-center gap-3">
                      <div className="w-1 h-8 bg-rose-600 rounded-full"></div>
                      {serverError}
                    </div>
                 )}

                 <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl font-black text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 active:scale-[0.98] transition-all group" 
                    disabled={isLoading}
                 >
                    {isLoading ? (
                       <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" /> {t.login_page.submitting}
                       </>
                    ) : (
                       <>
                          {t.login_page.submit} <Sparkles className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                       </>
                    )}
                 </Button>
              </form>
            </Form>

            <div className="mt-6 text-center space-y-4">
               <p className="text-sm text-slate-500 font-medium tracking-tight">
                  {t.login_page.no_account || "Pas encore de compte ?"} <I18nLink href="/register" className="text-primary font-black hover:underline transition-all active:scale-95 inline-block">{t.login_page.register_link || "Inscrire ma clinique"}</I18nLink>
               </p>
               
               <div className="pt-4 border-t border-slate-100/50">
                  <I18nLink href="/superadmin" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Accès Plateforme Administrateur
                  </I18nLink>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 space-y-4">
               <p className="text-xs text-slate-400 font-medium text-center italic">
                  {t.login_page.help_text} <I18nLink href="#" className="text-primary font-bold not-italic hover:underline">{t.login_page.contact_support}</I18nLink>
               </p>
               <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-1.5 grayscale opacity-50">
                     <ShieldCheck className="h-4 w-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest leading-none">LOI 25 CERTIFIED</span>
                  </div>
               </div>
            </div>
         </Card>

         <div className="absolute bottom-8 text-[10px] text-slate-400 uppercase font-black tracking-widest hidden lg:block">
            SÉCURISÉ PAR DENTAFLOW SYSTEMS INC. © 2026
         </div>
      </div>
    </div>
  )
}
