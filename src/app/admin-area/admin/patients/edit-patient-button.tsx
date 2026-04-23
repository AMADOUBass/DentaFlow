'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import { PatientForm } from './patient-form'
import { Patient } from '@prisma/client'

export function EditPatientButton({ patient }: { patient: Patient }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg font-bold gap-2"
      >
        <Edit2 className="h-4 w-4" /> Modifier les infos
      </Button>
      <PatientForm 
        patient={patient}
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  )
}
