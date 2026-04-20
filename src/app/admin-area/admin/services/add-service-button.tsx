'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ServiceForm } from './service-form'

export function AddServiceButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="h-12 px-6 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20 gap-2"
      >
        <Plus className="h-4 w-4" /> Nouveau Service
      </Button>
      <ServiceForm open={open} onOpenChange={setOpen} />
    </>
  )
}
