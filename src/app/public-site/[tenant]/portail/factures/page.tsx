import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CreditCard, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { createClinicalInvoiceSession } from '@/server/actions/stripe-clinical'
import { getTenantPath } from '@/lib/tenant'

interface InvoicesPageProps {
  params: Promise<{ tenant: string }>
}

export default async function PatientInvoicesPage({ params }: InvoicesPageProps) {
  const { tenant: tenantSlug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) redirect(await getTenantPath('/login/patient'))

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
  if (!tenant) redirect('/')

  const patient = await (prisma.patient as any).findUnique({
    where: { 
      tenantId_email: { 
        tenantId: tenant.id, 
        email: user.email 
      } 
    },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      }
    }
  })

  if (!patient) redirect('/')

  const invoices = (patient as any).invoices

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes Factures</h1>
        <p className="text-slate-500 font-medium mt-1">Consultez votre historique financier et réglez vos soldes en ligne.</p>
      </div>

      <div className="grid gap-6">
        {invoices.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center space-y-4 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
               <FileText className="h-10 w-10" />
            </div>
            <p className="text-xl font-black text-slate-900">Aucune facture pour le moment</p>
            <p className="text-slate-400 font-medium max-w-xs mx-auto">Toutes vos factures cliniques apparaîtront ici dès qu'elles seront émises par votre dentiste.</p>
          </div>
        ) : (
          invoices.map((invoice: any) => (
            <div key={invoice.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col md:flex-row">
              {/* Left Side: Info */}
              <div className="p-8 flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                       <h3 className="text-lg font-black text-slate-900 tracking-tight">Facture #{invoice.id.slice(-6)}</h3>
                       <Badge className={cn(
                         "font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full",
                         invoice.status === 'PAID' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                       )}>
                         {invoice.status === 'PAID' ? 'Payée' : 'À régler'}
                       </Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-400 mt-1">Émise le {format(new Date(invoice.createdAt), 'd MMMM yyyy', { locale: fr })}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                   {invoice.items.slice(0, 2).map((item: any, idx: number) => (
                     <div key={idx} className="text-xs font-medium text-slate-500 flex justify-between">
                        <span>{item.description}</span>
                        <span>{(item.amount * item.quantity).toFixed(2)}$</span>
                     </div>
                   ))}
                   {invoice.items.length > 2 && (
                     <p className="text-xs text-slate-400 italic">... et {invoice.items.length - 2} autres actes</p>
                   )}
                </div>
              </div>

              {/* Right Side: Financials & Action */}
              <div className="p-8 bg-slate-50/50 w-full md:w-80 flex flex-col justify-center items-center gap-6">
                <div className="text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total à votre charge</p>
                   <p className="text-4xl font-black text-slate-900 tracking-tighter">
                     {invoice.patientShare.toFixed(2)}$
                   </p>
                   {invoice.insuranceShare > 0 && (
                     <p className="text-[10px] font-bold text-emerald-600 uppercase mt-2">
                       + {invoice.insuranceShare.toFixed(2)}$ couverts par l'assurance
                     </p>
                   )}
                </div>

                {invoice.status !== 'PAID' ? (
                  <form action={async () => {
                    'use server'
                    const { url } = await createClinicalInvoiceSession(invoice.id)
                    if (url) redirect(url)
                  }} className="w-full">
                    <Button className="w-full h-14 rounded-2xl font-black gap-3 shadow-lg shadow-primary/20 text-lg">
                      <CreditCard className="h-5 w-5" /> Payer maintenant
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 font-black">
                     <CheckCircle2 className="h-6 w-6" />
                     <span>Réglé avec succès</span>
                  </div>
                )}

                <Button variant="ghost" className="text-slate-400 font-bold gap-2 text-xs hover:bg-white">
                   <Download className="h-3 w-3" /> Télécharger Reçu (PDF)
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 rounded-[2rem] border border-amber-100 p-8 flex gap-6 items-start">
         <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
         <div>
            <h4 className="font-black text-amber-900 tracking-tight">Délai de paiement</h4>
            <p className="text-sm font-bold text-amber-700/80 leading-relaxed mt-1">
              Les factures doivent être réglées dans les 30 jours suivant la prestation des soins. Les paiements effectués via Stripe sont sécurisés et traités instantanément.
            </p>
         </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
