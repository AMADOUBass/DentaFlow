import { getAdminUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { ChevronLeft, Code2, Lock } from 'lucide-react'
import Link from 'next/link'
import { ApiKeysSection } from './ApiKeysSection'
import { WebhooksSection } from './WebhooksSection'

export const dynamic = 'force-dynamic'

export default async function IntegrationsPage() {
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { planTier: true }
  })

  const isPremium = tenant?.planTier === 'PREMIUM'

  const [apiKeys, webhooks] = isPremium
    ? await Promise.all([
        prisma.apiKey.findMany({
          where: { tenantId, revokedAt: null },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.webhookEndpoint.findMany({
          where: { tenantId },
          orderBy: { createdAt: 'desc' }
        })
      ])
    : [[], []]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Code2 className="h-8 w-8 text-primary" /> API & Intégrations
            </h1>
            <p className="text-slate-500 mt-1">
              Gérez vos clés API et webhooks pour connecter des systèmes tiers.
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-black uppercase tracking-widest ${
            isPremium
              ? 'bg-violet-50 text-violet-700 border-violet-100'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}>
            <Lock className="h-4 w-4" /> {isPremium ? 'Plan Premium' : 'Non disponible'}
          </div>
        </div>
      </div>

      {!isPremium ? (
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto">
            <Code2 className="h-8 w-8 text-violet-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Fonctionnalité réservée au plan Premium</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            L'accès à l'API REST et aux webhooks est inclus dans le plan <strong>Premium (899$/mois)</strong>.
            Connectez vos logiciels de facturation, CRM ou systèmes personnalisés.
          </p>
          <Link
            href="/admin-area/admin/settings/billing"
            className="inline-flex items-center gap-2 bg-primary text-white font-black px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Passer au plan Premium
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <ApiKeysSection initialKeys={apiKeys} />
          <WebhooksSection initialEndpoints={webhooks} />
        </div>
      )}
    </div>
  )
}
