'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, Heart, Activity, Pill, UserRoundCheck, ArrowRight, ClipboardList } from 'lucide-react'

const questionnaireSchema = z.object({
  heartIssues: z.boolean().default(false),
  diabetes: z.boolean().default(false),
  highBloodPressure: z.boolean().default(false),
  bloodThinners: z.boolean().default(false),
  isPregnant: z.boolean().default(false),
  isSmoker: z.boolean().default(false),
  surgeries: z.string().default(''),
  allergies: z.string().default(''),
  medications: z.string().default(''),
  conditions: z.array(z.string()).default([]),
})

type QuestionnaireInput = {
  heartIssues: boolean
  diabetes: boolean
  highBloodPressure: boolean
  bloodThinners: boolean
  isPregnant: boolean
  isSmoker: boolean
  surgeries: string
  allergies: string
  medications: string
  conditions: string[]
}

interface QuestionnaireStepProps {
  onBack: () => void
  onNext: (data: QuestionnaireInput) => void
}

export function QuestionnaireStep({ onBack, onNext }: QuestionnaireStepProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<QuestionnaireInput>({
    resolver: zodResolver(questionnaireSchema) as any,
    defaultValues: {
      heartIssues: false,
      diabetes: false,
      highBloodPressure: false,
      bloodThinners: false,
      isPregnant: false,
      isSmoker: false,
      allergies: '',
      medications: '',
      surgeries: '',
      conditions: []
    }
  })

  const watchHeart = watch('heartIssues')
  const watchDiabetes = watch('diabetes')
  const watchPregnant = watch('isPregnant')

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100">
          <AlertCircle className="h-3 w-3" /> Information Médicale Critique
        </div>
        <h2 className="text-2xl font-black text-slate-900">Bilan de santé</h2>
        <p className="text-slate-500">Ces informations sont essentielles pour la sécurité de vos soins.</p>
      </div>

      <form onSubmit={handleSubmit((data) => onNext(data as any as QuestionnaireInput))} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[2rem] border bg-white space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                      <Heart className="h-5 w-5" />
                   </div>
                   <Label className="font-bold cursor-pointer" htmlFor="heartIssues">Problèmes cardiaques</Label>
                </div>
                <Switch 
                  id="heartIssues" 
                  checked={watchHeart} 
                  onCheckedChange={(val) => setValue('heartIssues', val)} 
                />
             </div>
             
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                      <Activity className="h-5 w-5" />
                   </div>
                   <Label className="font-bold cursor-pointer" htmlFor="diabetes">Diabète</Label>
                </div>
                <Switch 
                  id="diabetes" 
                  checked={watchDiabetes} 
                  onCheckedChange={(val) => setValue('diabetes', val)} 
                />
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                      <Activity className="h-5 w-5" />
                   </div>
                   <Label className="font-bold cursor-pointer" htmlFor="highBloodPressure">Hypertension</Label>
                </div>
                <Switch 
                  id="highBloodPressure" 
                  checked={watch('highBloodPressure')} 
                  onCheckedChange={(val) => setValue('highBloodPressure', val)} 
                />
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                      <Pill className="h-5 w-5" />
                   </div>
                   <Label className="font-bold cursor-pointer" htmlFor="bloodThinners">Anticoagulants</Label>
                </div>
                <Switch 
                  id="bloodThinners" 
                  checked={watch('bloodThinners')} 
                  onCheckedChange={(val) => setValue('bloodThinners', val)} 
                />
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                      <UserRoundCheck className="h-5 w-5" />
                   </div>
                   <Label className="font-bold cursor-pointer" htmlFor="isPregnant">Grossesse (si applicable)</Label>
                </div>
                <Switch 
                  id="isPregnant" 
                  checked={watchPregnant} 
                  onCheckedChange={(val) => setValue('isPregnant', val)} 
                />
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                      <Activity className="h-5 w-5" />
                   </div>
                   <Label className="font-bold cursor-pointer" htmlFor="isSmoker">Fumeur / Vapoteur</Label>
                </div>
                <Switch 
                  id="isSmoker" 
                  checked={watch('isSmoker')} 
                  onCheckedChange={(val) => setValue('isSmoker', val)} 
                />
             </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
                <Label className="font-bold ml-1 flex items-center gap-2">
                   <AlertCircle className="h-4 w-4 text-rose-500" /> Chirurgies ou hospitalisations récentes
                </Label>
                <Textarea 
                  {...register('surgeries')}
                  className="rounded-2xl min-h-[80px] border-slate-200"
                  placeholder="Précisez les dates et raisons..."
                />
             </div>

             <div className="space-y-2">
                <Label className="font-bold ml-1 flex items-center gap-2">
                   <Pill className="h-4 w-4 text-amber-500" /> Allergies connues
                </Label>
                <Textarea 
                  {...register('allergies')}
                  className="rounded-2xl min-h-[80px] border-slate-200"
                  placeholder="Ex: Pénicilline, Latex..."
                />
             </div>
             
             <div className="space-y-2">
                <Label className="font-bold ml-1">Médicaments actuels</Label>
                <Textarea 
                  {...register('medications')}
                  className="rounded-2xl min-h-[100px] border-slate-200"
                  placeholder="Liste des médicaments que vous prenez..."
                />
             </div>
             <div className="space-y-2">
                <Label className="font-bold ml-1 flex items-center gap-2">
                   <ClipboardList className="h-4 w-4 text-primary" /> Autres antécédents médicaux
                </Label>
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                   {[
                     'Asthme', 'Épilepsie', 'Arthrite', 'Anémie', 
                     'Thyroïde', 'Hépatite', 'VIH/Sida', 'Cancer',
                     'Gastrite', 'Sinusite', 'Tuberculose'
                   ].map((condition) => (
                     <div key={condition} className="flex items-center space-x-2">
                       <Checkbox 
                         id={condition} 
                         checked={watch('conditions')?.includes(condition)}
                         onCheckedChange={(checked) => {
                           const current = watch('conditions') || []
                           if (checked) {
                             setValue('conditions', [...current, condition])
                           } else {
                             setValue('conditions', current.filter(c => c !== condition))
                           }
                         }}
                       />
                       <label 
                         htmlFor={condition} 
                         className="text-sm font-medium leading-none cursor-pointer text-slate-600"
                       >
                         {condition}
                       </label>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
              Confidentialité garantie — Ces données sont protégées par le secret médical et la Loi 25.
           </p>
        </div>

        <div className="flex justify-between pt-4 gap-4">
          <Button type="button" variant="ghost" onClick={onBack} className="font-bold">Retour</Button>
          <Button 
             type="submit"
             className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
             Continuer vers le paiement <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
