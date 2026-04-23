'use client'

import { Service } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Check } from 'lucide-react'

interface ServiceStepProps {
  services: Service[]
  selectedId: string | null
  onSelect: (id: string) => void
  onNext: () => void
}

export function ServiceStep({ services, selectedId, onSelect, onNext }: ServiceStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Quel service recherchez-vous ?</h2>
        <p className="text-slate-500">Sélectionnez le type de soin souhaité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card 
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`p-6 cursor-pointer border-2 transition-all rounded-[2rem] relative overflow-hidden ${
              selectedId === service.id 
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                : 'border-slate-100 hover:border-primary/20'
            }`}
          >
            {selectedId === service.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-lg">{service.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{service.description || "Soins professionnels personnalisés."}</p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Clock className="h-3 w-3" /> {service.durationMin} minutes
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={onNext} 
          disabled={!selectedId}
          className="h-14 px-10 rounded-2xl bg-slate-900 font-bold"
        >
          Suivant
        </Button>
      </div>
    </div>
  )
}
