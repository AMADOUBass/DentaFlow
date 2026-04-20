import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from './profile-form'

interface ProfilePageProps {
  params: { tenant: string }
}

export default async function PatientProfilePage({ params }: ProfilePageProps) {
  const { tenant: tenantSlug } = params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) redirect(`/login/patient`)

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
  if (!tenant) redirect('/')

  const patient = await prisma.patient.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email: user.email } }
  })

  if (!patient) redirect('/')

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mon Profil</h1>
        <p className="text-slate-500 mt-2">Gérez vos informations personnelles et vos préférences.</p>
      </div>
      
      <ProfileForm patient={patient} tenantId={tenant.id} />
    </div>
  )
}
