'use client'

import { useState } from 'react'
import { deletePatientAction } from '@/server/patients'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { isNextRedirect } from '@/lib/action-utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeletePatientButtonProps {
  patientId: string
  patientName: string
}

export function DeletePatientButton({ patientId, patientName }: DeletePatientButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deletePatientAction('', patientId)
      if (result.success) {
        toast.success(`Le dossier de ${patientName} a été supprimé.`)
        setOpen(false)
      }
    } catch (error) {
      if (isNextRedirect(error)) throw error
      toast.error("Impossible de supprimer le dossier. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
               <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-slate-900">
              Supprimer le dossier ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium text-base">
              Êtes-vous certain de vouloir supprimer définitivement le dossier de <span className="font-bold text-slate-900">{patientName}</span> ? 
              Cette action est irréversible selon les normes de la Loi 25.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel className="rounded-xl font-bold h-12 border-slate-200">Annuler</AlertDialogCancel>
            <Button 
              onClick={handleDelete}
              disabled={isLoading}
              className="rounded-xl font-black h-12 bg-rose-600 hover:bg-rose-700 text-white min-w-[120px] uppercase tracking-widest text-[10px]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer Définitivement"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
