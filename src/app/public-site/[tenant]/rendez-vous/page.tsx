import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import { AppointmentWizard } from './appointment-wizard'

export default async function RendezVousPage() {
  const tenant = await getTenant()

  if (!tenant) {
    return notFound()
  }

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AppointmentWizard 
          tenantId={tenant.id}
          services={tenant.services}
          practitioners={tenant.practitioners}
        />
      </div>
    </div>
  )
}
