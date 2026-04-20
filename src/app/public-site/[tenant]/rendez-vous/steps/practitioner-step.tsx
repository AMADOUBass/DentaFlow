'use client'

import { Practitioner } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Check, Zap } from 'lucide-react'
import Image from 'next/image'

interface PractitionerStepProps {
  practitioners: Practitioner[]
  selectedId: string | null
  onSelect: (id: string) => void
  onNext: () => void
  onBack: () => void
}

export function PractitionerStep({ 
  practitioners, 
  selectedId, 
  onSelect, 
  onNext, 
  onBack 
}: PractitionerStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Avec qui souhaitez-vous prendre RDV ?</h2>
        <p className="text-slate-500">Choisissez votre praticien préféré ou optez pour la rapidité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Special Option: Any Practitioner */}
        <Card 
          onClick={() => onSelect('any')}
          className={`p-6 cursor-pointer border-2 transition-all rounded-[2rem] relative overflow-hidden flex items-center gap-4 ${
            selectedId === 'any' 
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
              : 'border-slate-100 hover:border-primary/20 bg-slate-50/50'
          }`}
        >
          <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-black text-slate-900">Premier disponible</h3>
            <p className="text-sm text-slate-500 italic">Optimisez votre temps</p>
          </div>
          {selectedId === 'any' && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
          )}
        </Card>

        {/* Individual Practitioners */}
        {practitioners.map((practitioner) => (
          <Card 
            key={practitioner.id}
            onClick={() => onSelect(practitioner.id)}
            className={`p-6 cursor-pointer border-2 transition-all rounded-[2rem] relative overflow-hidden flex items-center gap-4 ${
              selectedId === practitioner.id 
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                : 'border-slate-100 hover:border-primary/20'
            }`}
          >
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
              {practitioner.photoUrl ? (
                <Image 
                  src={practitioner.photoUrl} 
                  alt={practitioner.lastName} 
                  width={56} 
                  height={56} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="h-6 w-6 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="font-black text-slate-900">{practitioner.title} {practitioner.lastName}</h3>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">{practitioner.specialty || 'Dentiste'}</p>
            </div>
            {selectedId === practitioner.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                <Check className="h-4 w-4" />
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="font-bold">Retour</Button>
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
