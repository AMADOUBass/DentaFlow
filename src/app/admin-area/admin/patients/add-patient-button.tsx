'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { PatientForm } from './patient-form'

export function AddPatientButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="h-12 px-6 rounded-xl font-black bg-primary shadow-lg shadow-primary/20 gap-2 uppercase tracking-tight text-[11px]"
      >
        <UserPlus className="h-4 w-4" /> Nouveau Patient
      </Button>
      <PatientForm open={open} onOpenChange={setOpen} />
    </>
  )
}
