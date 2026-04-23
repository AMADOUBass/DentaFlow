import { prisma } from '@/lib/prisma'
import { getTranslations, useTranslations } from '@/lib/i18n'
import { getLocaleServer } from '@/lib/i18n-server'
import { I18nLink } from '@/components/I18nLink'
import { PatientLoginForm } from './PatientLoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function PatientLoginPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantSlug } = await params
  const locale = await getLocaleServer()
  const t = useTranslations(locale)

  // Récupérer les infos de la clinique
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug }
  })

  if (!tenant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <I18nLink href="/" className="inline-flex items-center justify-center mb-6">
            {tenant.logoUrl ? (
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                 <Image 
                    src={tenant.logoUrl} 
                    alt={tenant.name} 
                    fill 
                    className="object-cover"
                 />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            )}
          </I18nLink>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {locale === 'fr' ? `Portail Patient` : `Patient Portal`}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {tenant.name}
          </p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-xl font-bold">{t.patient_login.card_title}</CardTitle>
            <CardDescription>
              {t.patient_login.card_desc}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <PatientLoginForm t={t} tenantSlug={tenantSlug} />
          </CardContent>
        </Card>

        <p className="text-center text-[10px] uppercase tracking-widest font-black text-slate-400">
          Propulsé par <span className="text-primary italic">Oros</span>
        </p>
      </div>
    </div>
  )
}
