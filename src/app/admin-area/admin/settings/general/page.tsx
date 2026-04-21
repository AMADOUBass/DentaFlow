import { getAdminUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { GeneralForm } from './general-form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function GeneralSettingsPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin-area/admin/settings" 
          className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-primary/20 transition-all shadow-sm">
            <ChevronLeft className="h-5 w-5" />
          </div>
          Retour aux réglages
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Informations Cliniques</h1>
          <p className="text-slate-500 mt-1">Gérez l'identité et les coordonnées de votre établissement.</p>
        </div>
      </div>

      <GeneralForm initialData={tenant} />
    </div>
  )
}
