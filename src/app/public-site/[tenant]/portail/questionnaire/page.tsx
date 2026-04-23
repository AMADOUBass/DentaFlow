import { getTenant } from '@/lib/tenant'
import { getMedicalQuestionnaire } from '@/server/actions/questionnaire'
import { notFound } from 'next/navigation'
import { QuestionnaireForm } from './questionnaire-form'
import { ClipboardList, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { getTenantPath } from '@/lib/tenant'

export default async function QuestionnairePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params
  const tenant = await getTenant()
  if (!tenant) return notFound()

  const questionnaire = await getMedicalQuestionnaire(tenant.id)

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <Link 
             href={await getTenantPath('/portail')} 
             className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-2"
           >
              <ChevronLeft className="h-4 w-4" /> Retour au tableau de bord
           </Link>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ClipboardList className="h-10 w-10 text-primary" /> Bilan de Santé
           </h1>
           <p className="text-slate-500 font-medium">Maintenez votre dossier médical à jour pour des soins sécuritaires.</p>
        </div>
      </div>

      <div className="bg-slate-50/50 p-2 md:p-8 rounded-[3rem] border-2 border-slate-100">
         <QuestionnaireForm 
           tenantId={tenant.id} 
           initialData={questionnaire} 
         />
      </div>
    </div>
  )
}
