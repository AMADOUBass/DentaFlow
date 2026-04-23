'use client'

import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { getAvailableSlotsAction } from '@/server/appointments'
import { Loader2, Clock, CalendarX } from 'lucide-react'

interface SlotsStepProps {
  tenantId: string
  serviceId: string
  practitionerId: string
  date: string
  selectedSlot: string | null
  onSelect: (slot: string) => void
  onNext: () => void
  onBack: () => void
}

export function SlotsStep({
  tenantId,
  serviceId,
  practitionerId,
  date,
  selectedSlot,
  onSelect,
  onNext,
  onBack
}: SlotsStepProps) {
  const [slots, setSlots] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startTransition(async () => {
      setError(null)
      const result = await getAvailableSlotsAction(tenantId, practitionerId, serviceId, date)
      if (result.success) {
        setSlots(result.slots || [])
      } else {
        setError(result.error || "Une erreur est survenue")
      }
    })
  }, [tenantId, serviceId, practitionerId, date])

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900">À quelle heure ?</h2>
        <p className="text-slate-500">Choisissiez parmi les créneaux disponibles pour le {date}.</p>
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
           <Loader2 className="h-10 w-10 animate-spin text-primary" />
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Calcul des disponibilités...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 rounded-[2.5rem] border border-rose-100 text-rose-600">
          {error}
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
           <CalendarX className="h-10 w-10 text-slate-300" />
           <div>
              <p className="font-bold text-slate-900">Aucun créneau disponible</p>
              <p className="text-sm text-slate-500">Essayez une autre date ou un autre praticien.</p>
           </div>
           <Button variant="outline" onClick={onBack} className="rounded-xl">Changer de date</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {slots.map((slot) => (
            <Button
              key={slot}
              variant={selectedSlot === slot ? 'default' : 'outline'}
              onClick={() => onSelect(slot)}
              className={`h-16 rounded-2xl font-black text-base transition-all duration-300 ${
                selectedSlot === slot 
                  ? 'bg-primary text-white scale-105 shadow-xl shadow-primary/30 border-none' 
                  : 'border-slate-100 hover:border-primary/30 hover:bg-primary/5 hover:text-primary text-slate-600'
              }`}
            >
              <Clock className="mr-2 h-4 w-4 opacity-50" />
              {slot}
            </Button>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="font-bold">Retour</Button>
        <Button 
          onClick={onNext} 
          disabled={!selectedSlot}
          className="h-14 px-10 rounded-2xl bg-slate-900 font-bold"
        >
          Valider le créneau
        </Button>
      </div>
    </div>
  )
}
