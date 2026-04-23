'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import { PractitionerForm } from './practitioner-form'
import { Practitioner } from '@prisma/client'

export function EditPractitionerButton({ practitioner }: { practitioner: Practitioner }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setOpen(true)}
        className="h-9 w-9 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <PractitionerForm 
        practitioner={practitioner} 
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  )
}
