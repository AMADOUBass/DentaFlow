'use client'

import { useState } from 'react'
import { Download, ShieldAlert, FileJson, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { exportFullClinicDataAction } from '@/server/export'

export default function ExportPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleExport = async () => {
    if (!confirm("Attention: Ce fichier contiendra l'intégralité des données sensibles de vos patients. Assurez-vous de le stocker dans un endroit sécurisé. Voulez-vous continuer ?")) {
      return
    }

    setLoading(true)
    try {
      const data = await exportFullClinicDataAction()
      
      // Create a blob and download it
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `DentaFlow_Export_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setDone(true)
    } catch (e) {
      alert("Une erreur est survenue lors de l'exportation.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portabilité des Données</h1>
        <p className="text-slate-500 mt-2">Conformité Loi 25 : Exportez l'intégralité de votre base de données clinique.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
         <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                     <FileJson className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                     <CardTitle className="text-2xl font-black">Archive Complète</CardTitle>
                     <CardDescription className="text-slate-400">Format JSON Standard — Portable & Structuré</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
               <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                  <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
                  <div className="space-y-2">
                     <p className="text-sm font-black text-amber-900 uppercase tracking-widest">Avertissement de Sécurité</p>
                     <p className="text-sm text-amber-800 leading-relaxed font-medium">
                        Ce fichier contient des informations médicales et personnelles hautement sensibles (RAMQ, notes cliniques, historique de facturation). 
                        En téléchargeant cette archive, vous devenez responsable de sa garde sécurisée conformément aux normes du Collège des Dentistes du Québec.
                     </p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">Ce que contient cet export :</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {['Dossiers Patients', 'Notes Cliniques (DPI)', 'Historique de Facturation', 'Odonthogrammes', 'Prescriptions', 'Journaux d\'Audit (Loi 25)'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="pt-6 border-t">
                  {done ? (
                    <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-3 font-bold">
                          <CheckCircle2 className="h-5 w-5" /> Exportation réussie !
                       </div>
                       <Button variant="outline" onClick={() => setDone(false)} className="rounded-xl font-bold border-emerald-200">
                         Nouvel export
                       </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleExport}
                      disabled={loading}
                      className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg gap-3 shadow-xl transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Génération de l'archive en cours...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5" />
                          Générer et télécharger l'exportation complète
                        </>
                      )}
                    </Button>
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
