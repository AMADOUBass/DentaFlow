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
        <Card className="p-8 md:p-12 rounded-[3.5rem] border-slate-100 shadow-2xl shadow-slate-200/60 bg-white">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelect}
            locale={fr}
            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
            className="p-0"
            classNames={{
               months: "flex flex-col space-y-4",
               month: "space-y-6",
               month_caption: "flex justify-center pt-1 relative items-center mb-4",
               caption_label: "text-lg font-black text-slate-900 uppercase tracking-widest",
               nav: "space-x-1 flex items-center",
               button_previous: "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100",
               button_next: "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100",
               table: "w-full border-collapse space-y-1",
               head_row: "flex w-full mb-2",
               head_cell: "text-slate-400 rounded-md flex-1 font-black uppercase text-[10px] tracking-[0.2em] text-center",
               row: "flex w-full mt-2",
               cell: "flex-1 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
               day: "h-14 w-14 md:h-16 md:w-16 p-0 font-bold aria-selected:opacity-100 hover:bg-slate-50 rounded-2xl transition-all flex items-center justify-center mx-auto",
               day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-xl shadow-primary/20 scale-110",
               day_today: "bg-slate-100 text-slate-900",
               day_outside: "text-slate-300 opacity-50",
               day_disabled: "text-slate-200 opacity-50 cursor-not-allowed",
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
