import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import { AppointmentWizard } from './appointment-wizard'
import { CheckCircle2, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RendezVousPageProps {
  searchParams: Promise<{ payment?: string }>
}

export default async function RendezVousPage({ searchParams }: RendezVousPageProps) {
  const { payment } = await searchParams
  const tenant = await getTenant()

  if (!tenant) return notFound()

  // Retour depuis Stripe après paiement du dépôt
  if (payment === 'success') {
    return (
      <div className="py-20 bg-white flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Rendez-vous confirmé !</h2>
            <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
              Votre acompte a été reçu. Vous recevrez un courriel et un SMS de confirmation sous peu.
            </p>
          </div>
          <Link href="/">
            <Button className="h-14 px-8 rounded-2xl bg-slate-900 font-bold gap-2">
              <Home className="h-5 w-5" /> Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AppointmentWizard
          tenantId={tenant.id}
          tenantSlug={tenant.slug}
          services={tenant.services}
          practitioners={tenant.practitioners}
        />
      </div>
    </div>
  )
}
