'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import { ServiceForm } from './service-form'
import { Service } from '@prisma/client'

export function EditServiceButton({ service }: { service: Service }) {
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
      <ServiceForm 
        service={service} 
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  )
}
