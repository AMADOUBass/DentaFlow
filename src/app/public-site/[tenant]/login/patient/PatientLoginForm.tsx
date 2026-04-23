'use client'

import { useState } from 'react'
import { loginWithMagicLink } from '@/server/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface PatientLoginFormProps {
  t: any
  tenantSlug: string
}

export function PatientLoginForm({ t, tenantSlug }: PatientLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    formData.set('tenantSlug', tenantSlug)
    const result = await loginWithMagicLink(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(result?.success)
      setIsSent(true)
    }
    setIsLoading(false)
  }

  if (isSent) {
    return (
      <div className="text-center space-y-6 py-4 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <Mail className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900">{t.patient_login.success_title}</h3>
          <p className="text-slate-500 max-w-[280px] mx-auto text-sm leading-relaxed">
            {t.patient_login.success_desc}
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="text-primary font-bold"
          onClick={() => setIsSent(false)}
        >
          {t.patient_login.retry}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-bold ml-1">{t.patient_login.email_label}</Label>
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
            {t.patient_login.submit} 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  )
}
