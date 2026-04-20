'use client'

import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { fr } from 'date-fns/locale'

interface CalendarStepProps {
  selectedDate: Date | undefined
  onSelect: (date: Date | undefined) => void
  onNext: () => void
  onBack: () => void
}

export function CalendarStep({ 
  selectedDate, 
  onSelect, 
  onNext, 
  onBack 
}: CalendarStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900">À quel moment ?</h2>
        <p className="text-slate-500">Sélectionnez la date de votre visite.</p>
      </div>

      <div className="flex justify-center">
        <Card className="p-4 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelect}
            locale={fr}
            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
            className="rounded-xl border-none"
            classNames={{
               day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
               day_today: "bg-accent text-accent-foreground font-black",
            }}
          />
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="font-bold">Retour</Button>
        <Button 
          onClick={onNext} 
          disabled={!selectedDate}
          className="h-14 px-10 rounded-2xl bg-slate-900 font-bold"
        >
          Voir les créneaux
        </Button>
      </div>
    </div>
  )
}
