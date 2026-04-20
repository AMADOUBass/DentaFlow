import { getAdminUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, Receipt, Zap, ArrowUpCircle } from 'lucide-react'
import { openBillingPortalAction } from '@/server/billing'
import Link from 'next/link'

export default async function BillingSettingsPage() {
  const user = await getAdminUser()
  
  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId! }
  })

  if (!tenant) return null

  const isSubscribed = !!tenant.stripeSubId

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Facturation</h1>
        <p className="text-slate-500 mt-2">Gérez votre abonnement, vos factures et vos modes de paiement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Plan Summary */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
           <CardHeader className="bg-slate-900 text-white p-10 pb-16">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-primary font-black uppercase tracking-widest text-xs">Forfait Actuel</p>
                    <CardTitle className="text-4xl font-black">{tenant.planTier}</CardTitle>
                 </div>
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Zap className="h-8 w-8 text-primary" />
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-10 -mt-10 bg-white rounded-[2.5rem] relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Statut de l'abonnement</h4>
                    <div className="flex items-center gap-3">
                       <Badge className={`rounded-xl font-bold px-4 py-1 ${isSubscribed ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                          {isSubscribed ? 'ACTIF' : 'GÉRÉ PAR ABBA'}
                       </Badge>
                       <p className="text-xs text-slate-400 font-medium italic">Prochain renouvellement le 20 mai 2026</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Mode de paiement</h4>
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                       <CreditCard className="h-5 w-5" />
                       {isSubscribed ? 'Visa se terminant par 4242' : 'Aucun moyen de paiement lié'}
                    </div>
                 </div>
              </div>

              <div className="mt-10 pt-10 border-t flex flex-wrap gap-4">
                 {isSubscribed ? (
                   <form action={openBillingPortalAction}>
                      <Button className="rounded-xl font-bold gap-2">
                         <Settings className="h-4 w-4" /> Gérer mon abonnement Stripe
                      </Button>
                   </form>
                 ) : (
                   <Link href="/admin-area/setup/pricing">
                      <Button className="rounded-xl font-bold gap-2 bg-primary">
                         <ArrowUpCircle className="h-4 w-4" /> Passer à un forfait supérieur
                      </Button>
                   </Link>
                 )}
                 <Button variant="outline" className="rounded-xl font-bold gap-2">
                    <Receipt className="h-4 w-4" /> Voir l'historique des factures
                 </Button>
              </div>
           </CardContent>
        </Card>

        {/* Info Sidebar */}
        <div className="space-y-6">
           <Card className="border-none shadow-sm rounded-[2.5rem] bg-emerald-50">
              <CardHeader>
                 <CardTitle className="text-lg font-bold text-emerald-900">Aide & Support</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-emerald-700 leading-relaxed font-medium">
                 Besoin d'aide avec votre facture ou d'un forfait sur mesure pour plusieurs cliniques ? 
                 Contactez notre équipe de support dédiée.
              </CardContent>
              <CardFooter>
                 <Button variant="link" className="text-emerald-700 font-black p-0">Contacter le support</Button>
              </CardFooter>
           </Card>
        </div>
      </div>
    </div>
  )
}

function Settings(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
