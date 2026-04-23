'use client'

import { useState } from 'react'
import { SignaturePad } from '@/components/admin/patients/SignaturePad'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldCheck, FileText, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function PatientConsentPage({ params }: { params: { id: string } }) {
  const [signature, setSignature] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveSignature = (dataUrl: string) => {
    setSignature(dataUrl)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulation de sauvegarde dans la DB (PatientMedia ou ClinicalNote)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Consentement enregistré avec succès !")
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
           <Link href={`/admin-area/admin/patients/${params.id}`}><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Consentement Éclairé</h1>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-900 p-10 text-white">
           <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Document Officiel</span>
           </div>
           <CardTitle className="text-2xl font-black">Autorisation de Traitement Dentaire</CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
           <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed font-medium">
                Je, soussigné(e), autorise les professionnels du <strong>Centre Dentaire Démo</strong> à effectuer les soins dentaires nécessaires tels que discutés lors de ma consultation. 
              </p>
              <ul className="text-sm text-slate-500 space-y-2 mt-4">
                 <li>• Je comprends les risques et bénéfices liés aux traitements.</li>
                 <li>• J'ai eu l'occasion de poser des questions et j'ai reçu des réponses satisfaisantes.</li>
                 <li>• Je consens à l'utilisation de mes informations de santé conformément à la Loi 25.</li>
              </ul>
           </div>

           <div className="pt-10 border-t border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black text-slate-900">Signature du Patient</h3>
                 <span className="text-xs font-bold text-slate-400 italic">Date : {new Date().toLocaleDateString('fr-CA')}</span>
              </div>
              
              <SignaturePad onSave={handleSaveSignature} onClear={() => setSignature(null)} />

              {signature && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-in fade-in zoom-in">
                   <ShieldCheck className="h-5 w-5 text-emerald-600" />
                   <p className="text-sm font-bold text-emerald-700">Signature capturée et sécurisée.</p>
                </div>
              )}
           </div>

           <div className="pt-6">
              <Button 
                onClick={handleSubmit}
                disabled={!signature || isSubmitting}
                className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg gap-3 shadow-xl shadow-slate-200 transition-all"
              >
                {isSubmitting ? "Enregistrement..." : "Confirmer et Enregistrer au Dossier"}
                <Send className="h-5 w-5" />
              </Button>
           </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-slate-400 font-medium px-10 leading-relaxed">
        Ce document sera conservé de manière sécurisée dans le dossier patient et est accessible uniquement par le personnel autorisé.
      </p>
    </div>
  )
}
