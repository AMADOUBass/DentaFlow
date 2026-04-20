'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Download, Trash2, Loader2, CheckCircle2 } from 'lucide-react'
import { exportPatientData, deletePatientRecord } from '@/server/privacy'
import { toast } from 'sonner'

interface PrivacyActionsProps {
  tenantId: string
}

export function PrivacyActions({ tenantId }: PrivacyActionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await exportPatientData(tenantId)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mes-donnees-dentaires-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success('Vos données ont été exportées avec succès (Loi 25)')
    } catch (error) {
      toast.error('Erreur lors de l’exportation')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteRequest = async () => {
    if (!confirm('Êtes-vous certain de vouloir demander la suppression de votre compte ? Vos données identifiables seront anonymisées conformément à la loi.')) return
    
    setIsDeleting(true)
    try {
      await deletePatientRecord(tenantId)
      toast.success('Demande de suppression enregistrée. Vous allez être déconnecté.')
      setTimeout(() => window.location.href = '/', 2000)
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      setIsDeleting(false)
    }
  }

  return (
    <Card className="border-2 border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
      <CardHeader className="bg-slate-50/50 pb-4">
        <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-800 uppercase tracking-widest">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Loi 25 & Vie privée
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          Vous avez le contrôle total sur vos renseignements personnels. Utilisez les outils ci-dessous pour exercer vos droits.
        </p>
        
        <div className="space-y-2">
           <Button 
             variant="outline" 
             className="w-full justify-start rounded-xl font-bold h-11 border-slate-200 hover:bg-slate-50 hover:text-primary transition-all"
             onClick={handleExport}
             disabled={isExporting}
           >
             {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
             Exporter mes données (JSON)
           </Button>
           
           <Button 
             variant="ghost" 
             className="w-full justify-start rounded-xl font-bold h-11 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
             onClick={handleDeleteRequest}
             disabled={isDeleting}
           >
             {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
             Droit à l'oubli
           </Button>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[9px] text-emerald-600 font-black uppercase tracking-tighter">
           <CheckCircle2 className="h-3 w-3" /> Vos données sont chiffrées (AES-256)
        </div>
      </CardContent>
    </Card>
  )
}
