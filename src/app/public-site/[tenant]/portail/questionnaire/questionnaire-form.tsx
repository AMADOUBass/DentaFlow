'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  AlertCircle, 
  Heart, 
  Activity, 
  Pill, 
  UserRoundCheck, 
  Save, 
  ClipboardList,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { saveMedicalQuestionnaire } from '@/server/actions/questionnaire'
import { toast } from 'sonner'

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

type QuestionnaireInput = z.infer<typeof questionnaireSchema>

interface QuestionnaireFormProps {
  tenantId: string
  initialData: any
}

export function QuestionnaireForm({ tenantId, initialData }: QuestionnaireFormProps) {
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<QuestionnaireInput>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      heartIssues: initialData?.heartIssues || false,
      diabetes: initialData?.diabetes || false,
      highBloodPressure: initialData?.highBloodPressure || false,
      bloodThinners: initialData?.bloodThinners || false,
      isPregnant: initialData?.isPregnant || false,
      isSmoker: initialData?.isSmoker || false,
      allergies: initialData?.allergies || '',
      medications: initialData?.medications || '',
      surgeries: initialData?.surgeries || '',
      conditions: Array.isArray(initialData?.conditions) ? initialData.conditions : []
    }
  })

  const onSubmit = async (data: QuestionnaireInput) => {
    setIsSaving(true)
    try {
      await saveMedicalQuestionnaire(tenantId, data)
      toast.success('Questionnaire mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const watchConditions = watch('conditions') || []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne Gauche - Commutateurs */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] border bg-white shadow-sm space-y-6">
             <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary" /> État de santé général
             </h3>
             
             {[
               { id: 'heartIssues', label: 'Problèmes cardiaques', icon: <Heart className="h-5 w-5" />, color: 'rose' },
               { id: 'diabetes', label: 'Diabète', icon: <Activity className="h-5 w-5" />, color: 'blue' },
               { id: 'highBloodPressure', label: 'Hypertension', icon: <Activity className="h-5 w-5" />, color: 'orange' },
               { id: 'bloodThinners', label: 'Anticoagulants', icon: <Pill className="h-5 w-5" />, color: 'slate' },
               { id: 'isPregnant', label: 'Grossesse (si applicable)', icon: <UserRoundCheck className="h-5 w-5" />, color: 'purple' },
               { id: 'isSmoker', label: 'Fumeur / Vapoteur', icon: <Activity className="h-5 w-5" />, color: 'orange' },
             ].map((item) => (
               <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-500`}>
                        {item.icon}
                     </div>
                     <Label className="font-bold cursor-pointer text-slate-700" htmlFor={item.id}>{item.label}</Label>
                  </div>
                  <Switch 
                    id={item.id} 
                    checked={watch(item.id as any)} 
                    onCheckedChange={(val) => setValue(item.id as any, val)} 
                  />
               </div>
             ))}
          </div>

          <div className="p-8 rounded-[2.5rem] border bg-white shadow-sm space-y-6">
             <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" /> Antécédents spécifiques
             </h3>
             <div className="grid grid-cols-2 gap-3">
                {[
                  'Asthme', 'Épilepsie', 'Arthrite', 'Anémie', 
                  'Thyroïde', 'Hépatite', 'VIH/Sida', 'Cancer',
                  'Gastrite', 'Sinusite', 'Tuberculose'
                ].map((condition) => (
                  <div key={condition} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-all">
                    <Checkbox 
                      id={condition} 
                      checked={watchConditions.includes(condition)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue('conditions', [...watchConditions, condition])
                        } else {
                          setValue('conditions', watchConditions.filter(c => c !== condition))
                        }
                      }}
                    />
                    <label 
                      htmlFor={condition} 
                      className="text-sm font-bold leading-none cursor-pointer text-slate-600"
                    >
                      {condition}
                    </label>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Colonne Droite - Textareas */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] border bg-white shadow-sm space-y-6">
             <div className="space-y-3">
                <Label className="font-black text-slate-900 flex items-center gap-2 ml-1">
                   <AlertCircle className="h-4 w-4 text-rose-500" /> Chirurgies récentes
                </Label>
                <Textarea 
                  {...register('surgeries')}
                  className="rounded-2xl min-h-[100px] border-slate-200 focus:ring-primary/20"
                  placeholder="Précisez les dates et raisons..."
                />
             </div>

             <div className="space-y-3">
                <Label className="font-black text-slate-900 flex items-center gap-2 ml-1">
                   <Pill className="h-4 w-4 text-amber-500" /> Allergies connues
                </Label>
                <Textarea 
                  {...register('allergies')}
                  className="rounded-2xl min-h-[100px] border-slate-200 focus:ring-primary/20"
                  placeholder="Ex: Pénicilline, Latex..."
                />
             </div>
             
             <div className="space-y-3">
                <Label className="font-black text-slate-900 flex items-center gap-2 ml-1">
                   <ClipboardList className="h-4 w-4 text-primary" /> Médicaments actuels
                </Label>
                <Textarea 
                  {...register('medications')}
                  className="rounded-2xl min-h-[120px] border-slate-200 focus:ring-primary/20"
                  placeholder="Liste des médicaments que vous prenez..."
                />
             </div>
          </div>

          <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-4">
             <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                   <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                   Vos données sont chiffrées et ne sont accessibles qu'à votre dentiste traitant, conformément à la Loi 25 du Québec.
                </p>
             </div>
             <Button 
               type="submit" 
               disabled={isSaving}
               className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
             >
               {isSaving ? (
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
               ) : (
                 <Save className="mr-2 h-5 w-5" />
               )}
               Enregistrer mon bilan
             </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
