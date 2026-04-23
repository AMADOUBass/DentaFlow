import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/auth-utils'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  FileText, 
  Activity, 
  Stethoscope, 
  FileSignature, 
  ChevronLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Plus,
  CreditCard,
  Receipt,
  Calculator,
  Image as ImageIcon
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DentalChart } from '@/components/admin/patients/DentalChart'
import { ClinicalNotes } from '@/components/admin/patients/ClinicalNotes'
import { InvoiceGenerator } from '@/components/admin/billing/InvoiceGenerator'
import { PatientInvoiceList } from '@/components/admin/billing/PatientInvoiceList'
import { MediaGallery } from '@/components/admin/patients/MediaGallery'
import { EditPatientButton } from '../edit-patient-button'
import { AddAppointmentButton } from '../../appointments/add-appointment-button'

interface PatientDossierPageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDossierPage({ params }: PatientDossierPageProps) {
  const { id } = await params
  const user = await getAdminUser()
  const tenantId = user.tenantId!

  // 1. Fetch Patient with all clinical history
  const patient = await (prisma.patient as any).findUnique({
    where: { id, tenantId },
    include: {
      clinicalNotes: {
        orderBy: { createdAt: 'desc' },
        include: { practitioner: true }
      },
      toothConditions: {
        include: { practitioner: true }
      },
      prescriptions: {
        orderBy: { createdAt: 'desc' },
        include: { practitioner: true }
      },
      appointments: {
        orderBy: { startsAt: 'desc' },
        include: { service: true, practitioner: true },
        take: 5
      },
      invoices: {
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      },
      insuranceProvider: true,
      media: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  // Fetch additional data for the AddAppointmentButton
  const [practitioners, services, allPatients] = await Promise.all([
    prisma.practitioner.findMany({ where: { tenantId }, orderBy: { lastName: 'asc' } }),
    prisma.service.findMany({ where: { tenantId, active: true }, orderBy: { order: 'asc' } }),
    prisma.patient.findMany({ where: { tenantId }, orderBy: { lastName: 'asc' } })
  ])

  if (!patient) notFound()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="flex items-center gap-4">
            <Link href="/admin-area/admin/patients">
               <Button variant="ghost" size="icon" className="rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                  <ChevronLeft className="h-5 w-5" />
               </Button>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                   <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dossier Patient</h1>
                   <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase border-slate-200 text-slate-500">ID: {id.slice(-6)}</Badge>
                      <span className="text-slate-300">•</span>
                      <p className="text-sm font-bold text-slate-500">{patient.firstName} {patient.lastName}</p>
                   </div>
                </div>
                <EditPatientButton patient={patient as any} />
             </div>
          </div>
       </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         {/* Patient Sidebar */}
         <div className="xl:col-span-1 space-y-6">
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-950 text-white overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all" />
               <CardHeader className="pb-4 relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                     <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-black">{patient.firstName} {patient.lastName}</CardTitle>
                  <p className="text-slate-400 font-medium">{patient.email}</p>
               </CardHeader>
               <CardContent className="space-y-6 relative z-10">
                  <div className="space-y-4 pt-4 border-t border-white/10">
                     <div className="flex items-center gap-3 text-slate-300">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold">{patient.phone}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-300">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold truncate">{patient.address || 'Adresse inconnue'}</span>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                     <Badge className="bg-primary/10 text-primary border-none font-bold py-1 px-3 rounded-lg">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Assuré
                     </Badge>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100">
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Antécédents & Notes</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-sm font-black text-slate-700 leading-relaxed italic">
                     "{patient.medicalNotes || "Aucune note particulière signalée."}"
                  </p>
               </CardContent>
            </Card>
         </div>

         {/* Detailed View Tabs */}
         <div className="xl:col-span-3">
            <Tabs defaultValue="overview" className="space-y-8">
               <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1">
                  <TabsTrigger value="overview" className="rounded-xl px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                     <Activity className="h-4 w-4" /> Aperçu
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="rounded-xl px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                     <FileText className="h-4 w-4" /> Notes Cliniques
                  </TabsTrigger>
                  <TabsTrigger value="chart" className="rounded-xl px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                     <Stethoscope className="h-4 w-4" /> Charte Dentaire
                  </TabsTrigger>
                  <TabsTrigger value="imagerie" className="rounded-xl px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                     <ImageIcon className="h-4 w-4" /> Imagerie
                  </TabsTrigger>
                  <TabsTrigger value="prescriptions" className="rounded-xl px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                     <FileSignature className="h-4 w-4" /> Ordonnances
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="rounded-xl px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                     <CreditCard className="h-4 w-4" /> Facturation
                  </TabsTrigger>
               </TabsList>

              <TabsContent value="overview">
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                       <h2 className="text-xl font-black text-slate-900">Prochains Rendez-vous</h2>
                       <AddAppointmentButton 
                          patients={allPatients} 
                          practitioners={practitioners} 
                          services={services} 
                          defaultPatientId={id}
                          variant="outline"
                       />
                    </div>
                     <div className="space-y-4">
                       {(patient as any).appointments?.length === 0 ? (
                         <p className="text-slate-400 italic">Aucun rendez-vous planifié.</p>
                       ) : (
                         (patient as any).appointments?.map((apt: any) => (
                           <div key={apt.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                 <Calendar className="h-5 w-5 text-primary" />
                                 <div>
                                    <p className="font-bold text-slate-900">{apt.service.name}</p>
                                    <p className="text-xs text-slate-400">{format(new Date(apt.startsAt), 'd MMMM yyyy HH:mm', { locale: fr })}</p>
                                 </div>
                              </div>
                              <Badge className="bg-white text-slate-900 border font-bold">{apt.status}</Badge>
                           </div>
                         ))
                       )}
                    </div>
                 </div>
              </TabsContent>

              <TabsContent value="notes">
                 <ClinicalNotes patientId={id} initialNotes={(patient as any).clinicalNotes} />
              </TabsContent>

              <TabsContent value="chart">
                 <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
                       <div>
                          <h3 className="text-xl font-black text-slate-900">Odonthogramme</h3>
                          <p className="text-sm font-medium text-slate-400 mt-1">Cliquez sur une dent pour voir ou ajouter une condition</p>
                       </div>
                    </div>
                    <DentalChart patientId={id} />
                 </div>
              </TabsContent>

              <TabsContent value="imagerie">
                 <MediaGallery 
                    patientId={id} 
                    tenantId={tenantId} 
                    initialMedia={(patient as any).media} 
                 />
              </TabsContent>

              <TabsContent value="prescriptions">
                 <div className="bg-white p-12 rounded-[2rem] border-dashed border-2 border-slate-100 text-center">
                    <FileSignature className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-slate-400">Aucune ordonnance générée</h3>
                    <Button variant="outline" className="mt-4 rounded-xl font-bold">Générer une ordonnance</Button>
                 </div>
              </TabsContent>

              <TabsContent value="billing">
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Générer une facture</h3>
                    <InvoiceGenerator 
                      patientId={id} 
                      insuranceCoveragePercent={patient.insuranceProvider?.coveragePercent || 0}
                    />
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Historique des factures</h3>
                    <PatientInvoiceList invoices={(patient as any).invoices} />
                  </div>
                </div>
              </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  )
}
