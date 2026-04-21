'use client'

import { useState } from 'react'
import { login } from '@/server/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Loader2, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslations, Locale } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'
import { toast } from 'sonner'

export default function LoginPage() {
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' as Locale : 'fr' as Locale
  const t = useTranslations(locale)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-slate-50 selection:bg-primary/20 overflow-hidden">
      {/* LEFT PANEL - Marketing & Visuals (Visible on MD+) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden p-20 flex-col justify-between">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

         <I18nLink href="/" className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl rotate-3">
              <span className="text-primary font-black text-xl">DF</span>
            </div>
            <span className="font-extrabold text-3xl tracking-tight text-white">Oros</span>
         </I18nLink>

         <div className="relative z-10 space-y-10">
            <h2 className="text-5xl font-black text-white leading-tight animate-in fade-in slide-in-from-left-4 duration-700">
               {t.login_page.headline_part1} <br />
               <span className="text-primary underline decoration-white/10 underline-offset-8">{t.login_page.headline_accent}</span>
               {t.login_page.headline_part2}
            </h2>
            
            <div className="space-y-6">
                {[
                  t.login_page.feature_law25,
                  t.login_page.feature_ai,
                  t.login_page.feature_ui
                ].map((text, i) => (
                  <div key={i} className={`flex items-center gap-4 text-white/80 animate-in fade-in slide-in-from-left-8 stagger-${i+1}`}>
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{text}</span>
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
            <I18nLink href="/" className="flex items-center gap-2">
               <div className="p-2 bg-primary rounded-xl shadow-lg">
                  <span className="font-bold text-white text-sm">DF</span>
               </div>
            </I18nLink>
         </div>

         <Card className="w-full max-w-md border-none shadow-none bg-transparent lg:p-4 animate-in fade-in zoom-in duration-500">
            <div className="space-y-2 mb-10 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider mb-2">
                  <ShieldCheck className="h-3 w-3" /> {t.login_page.secure_space}
               </div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t.login_page.portal_title}</h1>
               <p className="text-slate-500 font-medium tracking-tight">{t.login_page.portal_desc}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-bold ml-1">{t.login_page.email_label}</Label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                     <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="nom@clinique.ca" 
                        className="pl-11 h-12 rounded-2xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm focus:ring-primary/20" 
                        required 
                     />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                     <Label htmlFor="password" className="text-slate-700 font-bold">{t.login_page.password_label}</Label>
                     <I18nLink href="#" className="text-xs font-bold text-primary hover:underline">{t.login_page.forgot_password}</I18nLink>
                  </div>
                  <div className="relative">
                     <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                     <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        className="pl-11 h-12 rounded-2xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm focus:ring-primary/20" 
                        required 
                     />
                  </div>
               </div>

               {error && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold animate-in fade-in zoom-in duration-300 flex items-center gap-3">
                    <div className="w-1 h-8 bg-rose-600 rounded-full"></div>
                    {error}
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
