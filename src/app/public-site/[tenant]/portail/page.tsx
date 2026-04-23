import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  ChevronRight,
  AlertTriangle,
  History
} from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import { fr, enUS } from 'date-fns/locale'
import Link from 'next/link'
import { PrivacyActions } from './privacy-actions'
import { getLocaleServer, useTranslations } from '@/lib/i18n'
import { CancelButton } from './cancel-button'
import { getTenantPath, getTenant } from '@/lib/tenant'

interface PortalPageProps {
  params: Promise<{ tenant: string }>
}

export default async function PatientPortalPage({ params }: PortalPageProps) {
  const { tenant: tenantSlug } = await params
  const locale = await getLocaleServer()
  const t = useTranslations(locale)
  const dateLocale = locale === 'fr' ? fr : enUS

  const supabase = await createClient()

  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) redirect(await getTenantPath('/login/patient'))

  // 2. Get Tenant
  const tenant = await getTenant()
  if (!tenant) redirect('/')

  // 3. Get Patient and Appointments
  const patient = await prisma.patient.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email: user.email } },
    include: {
      appointments: {
        include: {
          practitioner: true,
          service: true
        },
        orderBy: { startsAt: 'desc' }
      }
    }
  })

  if (!patient) redirect('/')

  const upcomingApts = patient.appointments.filter(apt => isAfter(apt.startsAt, new Date()) && apt.status !== 'CANCELLED').reverse()
  const pastApts = patient.appointments.filter(apt => isBefore(apt.startsAt, new Date()) || apt.status === 'CANCELLED')

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content - Appointments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> {t.patient_portal.upcoming}
               </h3>
               {upcomingApts.length === 0 && (
                 <Link href={await getTenantPath('/rendez-vous')}>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold border-primary text-primary">{t.patient_portal.book_now}</Button>
                 </Link>
               )}
            </div>
            
            {upcomingApts.length === 0 ? (
              <Card className="border-dashed border-2 bg-slate-50/50 shadow-none rounded-[2rem]">
                 <CardContent className="py-12 text-center space-y-4">
                    <p className="text-slate-400 font-medium italic">{t.patient_portal.none_upcoming}</p>
                    <Link href={await getTenantPath('/rendez-vous')}>
                       <Button className="rounded-xl font-bold bg-primary shadow-lg shadow-primary/20">{t.patient_portal.book_now}</Button>
                    </Link>
                 </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                 {upcomingApts.map((apt) => {
                    const isCancelable = isAfter(apt.startsAt, addDays(new Date(), 1))
                    
                    return (
                      <Card key={apt.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                        <CardContent className="p-0">
                           <div className="flex flex-col sm:flex-row">
                              <div className="bg-primary/5 sm:w-32 flex flex-col items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-primary/10">
                                 <span className="text-xs font-black text-primary uppercase tracking-widest">{format(apt.startsAt, 'MMM', { locale: dateLocale })}</span>
                                 <span className="text-4xl font-black text-primary leading-none my-1">{format(apt.startsAt, 'd')}</span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">{format(apt.startsAt, 'eeee', { locale: dateLocale })}</span>
                              </div>
                              <div className="flex-1 p-6 relative">
                                 <div className="flex items-start justify-between">
                                    <div>
                                       <p className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors">{apt.service.name}</p>
                                       <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-1.5">
                                          <UserIcon className="h-3.5 w-3.5" /> 
                                          {apt.practitioner.title} {apt.practitioner.lastName}
                                       </p>
                                    </div>
                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase font-bold">CONFIRMÉ</Badge>
                                 </div>
                                 
                                 <div className="mt-6 flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                                       <Clock className="h-4 w-4 text-primary" /> {format(apt.startsAt, 'HH:mm')}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                       <MapPin className="h-4 w-4 text-slate-400" /> {tenant.address}
                                    </div>
                                 </div>

                                 <div className="mt-6 flex items-center justify-between">
                                    {!isCancelable ? (
                                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2 text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        {t.patient_portal.cancel_too_late}
                                      </div>
                                    ) : (
                                      <CancelButton 
                                        appointmentId={apt.id}
                                        label={t.patient_portal.cancel_apt}
                                        confirmTitle={t.patient_portal.cancel_confirm_title}
                                        confirmDesc={t.patient_portal.cancel_confirm_desc}
                                        confirmText={t.patient_portal.cancel_apt}
                                        cancelText={t.common.cancel}
                                        successMsg={t.patient_portal.cancel_success}
                                      />
                                    )}
                                 </div>
                              </div>
                           </div>
                        </CardContent>
                      </Card>
                    )
                 })}
              </div>
            )}
          </section>

          {/* Past Section */}
          <section>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
               <History className="h-5 w-5 text-slate-400" /> {t.patient_portal.past}
            </h3>
            <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
               {pastApts.length === 0 ? (
                 <div className="p-8 text-center text-slate-400 italic text-sm">{t.patient_portal.none_past}</div>
               ) : (
                 <div className="divide-y">
                    {pastApts.map((apt) => (
                       <div key={apt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <History className="h-5 w-5" />
                             </div>
                             <div>
                                <p className="font-bold text-slate-900">{apt.service.name}</p>
                                <p className="text-xs text-slate-400 font-medium">{format(apt.startsAt, 'd MMMM yyyy', { locale: dateLocale })}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <Badge variant="outline" className={`rounded-lg uppercase font-black text-[10px] ${apt.status === 'CANCELLED' ? 'text-rose-500 border-rose-100 bg-rose-50' : ''}`}>
                                {apt.status === 'CANCELLED' ? (locale === 'fr' ? 'ANNULÉ' : 'CANCELLED') : (locale === 'fr' ? 'TERMINÉ' : 'COMPLETED')}
                             </Badge>
                          </div>
                       </div>
                    ))}
                 </div>
               )}
            </div>
          </section>
        </div>

        {/* Sidebar - Quick Actions & Info */}
        <div className="space-y-6">
           <Card className="border-none shadow-sm rounded-[2rem] bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <CardHeader>
                 <CardTitle className="text-lg font-bold">{t.patient_portal.actions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative">
                 <Link href={await getTenantPath('/portail/profil')}>
                    <Button variant="secondary" className="w-full justify-start rounded-xl font-bold bg-white/10 border-white/5 hover:bg-white/20 text-white">
                       <UserIcon className="mr-2 h-4 w-4" /> {t.patient_portal.profile_cta}
                    </Button>
                 </Link>
                 <Link href={await getTenantPath('/rendez-vous')}>
                    <Button className="w-full justify-start rounded-xl font-bold bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20">
                       <Calendar className="mr-2 h-4 w-4" /> {t.patient_portal.new_apt}
                    </Button>
                 </Link>
              </CardContent>
           </Card>

           <PrivacyActions tenantId={tenant.id} tenantSlug={tenantSlug} locale={locale} />

           <Card className="border-none shadow-sm rounded-[2rem]">
              <CardHeader>
                 <CardTitle className="text-lg font-bold">{t.patient_portal.my_clinic}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                       <MapPin className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                       <p className="font-bold text-slate-900">{tenant.city}</p>
                       <p className="text-slate-500">{tenant.address}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                       <Clock className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                       <p className="font-bold text-slate-900">{t.patient_portal.open_today}</p>
                       <p className="text-slate-500">08:00 - 17:00</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
