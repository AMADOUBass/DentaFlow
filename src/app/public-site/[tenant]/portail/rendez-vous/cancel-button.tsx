'use client'

import { cancelAppointmentAction } from '@/server/appointments'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2, XCircle } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog'

import { useRouter } from 'next/navigation'

interface CancelAppointmentButtonProps {
  appointmentId: string
}

export function CancelAppointmentButton({ appointmentId }: CancelAppointmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const result = await cancelAppointmentAction(appointmentId)
      if (result.success) {
        toast.success('Rendez-vous annulé')
        setOpen(false)
        router.refresh()
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-rose-600 font-bold gap-2 hover:bg-rose-50 rounded-xl px-4">
           Annuler le RDV
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] sm:max-w-[425px]">
        <DialogHeader>
          <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-4">
             <XCircle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-black">Annuler ce rendez-vous ?</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Cette action est irréversible. Vous devrez reprendre rendez-vous si vous changez d'avis.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold flex-1">
             Oublier
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancel} 
            disabled={isLoading}
            className="rounded-xl font-bold bg-rose-600 flex-1"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Oui, annuler"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
