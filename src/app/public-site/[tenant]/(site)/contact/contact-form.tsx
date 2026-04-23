'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/schemas/contact'
import { submitContactRequest } from '@/server/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface ContactFormProps {
  tenantId: string
}

export function ContactForm({ tenantId }: ContactFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactInput) => {
    setIsPending(true)
    try {
      const result = await submitContactRequest(tenantId, data)
      if (result.success) {
        setIsSuccess(true)
        toast.success("Message envoyé avec succès")
        reset()
      } else {
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Une erreur réseau est survenue")
    } finally {
      setIsPending(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900">Message Envoyé !</h3>
          <p className="text-slate-500 text-sm font-medium">Nous vous répondrons sous 24 à 48 heures ouvrables.</p>
        </div>
        <Button variant="ghost" onClick={() => setIsSuccess(false)} className="text-primary font-bold">
          Envoyer un autre message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label className="font-bold ml-1 text-slate-700">Nom complet</Label>
        <Input 
          {...register('name')}
          className={`h-12 rounded-xl border-slate-200 focus:ring-primary/20 ${errors.name ? 'border-rose-500' : ''}`}
          placeholder="Jean Dupont"
        />
        {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="font-bold ml-1 text-slate-700">Courriel</Label>
        <Input 
          {...register('email')}
          className={`h-12 rounded-xl border-slate-200 focus:ring-primary/20 ${errors.email ? 'border-rose-500' : ''}`}
          placeholder="jean.dupont@exemple.com"
          type="email"
        />
        {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="font-bold ml-1 text-slate-700">Sujet</Label>
        <Input 
          {...register('subject')}
          className={`h-12 rounded-xl border-slate-200 focus:ring-primary/20 ${errors.subject ? 'border-rose-500' : ''}`}
          placeholder="Demande d'information générale"
        />
        {errors.subject && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.subject.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="font-bold ml-1 text-slate-700">Message</Label>
        <Textarea 
          {...register('message')}
          className={`rounded-xl border-slate-200 focus:ring-primary/20 min-h-[120px] ${errors.message ? 'border-rose-500' : ''}`}
          placeholder="Comment pouvons-nous vous aider ?"
        />
        {errors.message && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.message.message}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black text-lg transition-all active:scale-[0.98] disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>Envoyer le message <Send className="ml-2 h-4 w-4" /></>
        )}
      </Button>
    </form>
  )
}
