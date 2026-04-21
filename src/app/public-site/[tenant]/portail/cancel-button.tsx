'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, XCircle } from 'lucide-react'
import { cancelAppointmentAction } from '@/server/appointments'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CancelButtonProps {
  appointmentId: string
  label: string
  confirmTitle: string
  confirmDesc: string
  confirmText: string
  cancelText: string
  successMsg: string
}

export function CancelButton({ 
  appointmentId, 
  label, 
  confirmTitle, 
  confirmDesc, 
  confirmText, 
  cancelText,
  successMsg
}: CancelButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const result = await cancelAppointmentAction(appointmentId)
      if (result.success) {
        toast.success(successMsg)
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'annulation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold rounded-lg text-xs gap-2"
        >
          <XCircle className="h-3.5 w-3.5" /> {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2rem]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black">{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            {confirmDesc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="rounded-xl font-bold">{cancelText}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
