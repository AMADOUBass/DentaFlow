'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PractitionerForm } from './practitioner-form'

export function AddPractitionerButton({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="h-12 px-6 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20 gap-2"
      >
        <Plus className="h-4 w-4" /> Ajouter un praticien
      </Button>
      <PractitionerForm open={open} onOpenChange={setOpen} />
    </>
  )
}
