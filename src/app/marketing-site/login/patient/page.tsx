'use client'

import { useState } from 'react'
import { loginWithMagicLink } from '@/server/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope, Mail, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function PatientLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await loginWithMagicLink(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(result?.success)
      setIsSent(true)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-xl shadow-primary/20 mb-6">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Espace Patient</h1>
          <p className="text-slate-500 mt-2">Connectez-vous pour gérer vos rendez-vous.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-xl font-bold">Connexion sécurisée</CardTitle>
            <CardDescription>
              Pas besoin de mot de passe. Saisissez votre courriel pour recevoir un lien de connexion.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {!isSent ? (
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold ml-1">Adresse courriel</Label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                       <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="exemple@email.com" 
                          required 
                          className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all text-lg"
                       />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl font-bold text-lg bg-primary shadow-lg shadow-primary/20 gap-2 overflow-hidden group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Envoyer le lien 
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
               </form>
            ) : (
               <div className="text-center space-y-6 py-4 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                     <Mail className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-black text-slate-900">Vérifiez vos courriels !</h3>
                     <p className="text-slate-500 max-w-[280px] mx-auto text-sm leading-relaxed">
                        Nous venons d'envoyer un lien de connexion magique à votre adresse. 
                        Cliquez sur le lien pour accéder à votre portail.
                     </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-primary font-bold"
                    onClick={() => setIsSent(false)}
                  >
                    Renvoyer un lien
                  </Button>
               </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          En vous connectant, vous acceptez nos <Link href="#" className="underline">Conditions d'utilisation</Link> et notre <Link href="#" className="underline">Politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  )
}
