'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AppointmentForm } from './appointment-form'
import { Patient, Practitioner, Service } from '@prisma/client'

interface AddAppointmentButtonProps {
  patients: Patient[]
  practitioners: Practitioner[]
  services: Service[]
  defaultPatientId?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function AddAppointmentButton({ patients, practitioners, services, defaultPatientId, variant = 'default' }: AddAppointmentButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        variant={variant}
        className={variant === 'default' ? "h-12 px-6 rounded-xl font-black bg-slate-900 text-primary hover:bg-slate-800 shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px] gap-2" : "rounded-xl font-bold gap-2"}
      >
        <Plus className="h-4 w-4" /> Nouveau RDV
      </Button>
      <AppointmentForm 
        patients={patients}
        practitioners={practitioners}
        services={services}
        open={open} 
        onOpenChange={setOpen} 
        defaultPatientId={defaultPatientId}
      />
    </>
  )
}
