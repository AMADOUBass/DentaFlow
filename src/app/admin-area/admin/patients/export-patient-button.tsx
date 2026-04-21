'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { exportPatientData } from '@/server/privacy'
import { toast } from 'sonner'

interface ExportPatientButtonProps {
  tenantId: string
  patientId: string
  patientName: string
}

export function ExportPatientButton({ tenantId, patientId, patientName }: ExportPatientButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await exportPatientData(tenantId, patientId)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dossier-loi25-${patientName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success(`Dossier de ${patientName} exporté avec succès (Loi 25)`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l’exportation'
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="h-8 w-8 rounded-lg border-slate-200 hover:text-primary hover:border-primary transition-all"
      onClick={handleExport}
      disabled={isExporting}
      title="Exporter Loi 25 (JSON)"
    >
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
    </Button>
  )
}
