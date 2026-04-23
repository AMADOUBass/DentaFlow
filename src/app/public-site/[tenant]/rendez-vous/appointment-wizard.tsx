'use client'

import { useState } from 'react'
import { Service, Practitioner } from '@prisma/client'
import { Progress } from '@/components/ui/progress'
import { ServiceStep } from './steps/service-step'
import { PractitionerStep } from './steps/practitioner-step'
import { CalendarStep } from './steps/calendar-step'
import { SlotsStep } from './steps/slots-step'
import { ConfirmStep } from './steps/confirm-step'
import { QuestionnaireStep } from './steps/questionnaire-step'
import { PaymentStep } from './steps/payment-step'
import { format } from 'date-fns'
import { CheckCircle2, Home, Calendar as CalendarIcon, ShieldCheck as ShieldIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { saveMedicalQuestionnaireAction } from '@/server/appointments'
import { toast } from 'sonner'

interface AppointmentWizardProps {
  tenantId: string
  services: Service[]
  practitioners: Practitioner[]
}

type Step = 'service' | 'practitioner' | 'date' | 'slot' | 'patient' | 'questionnaire' | 'payment' | 'success'

export function AppointmentWizard({ tenantId, services, practitioners }: AppointmentWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('service')
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [practitionerId, setPractitionerId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [patientId, setPatientId] = useState<string | null>(null)
  
  // Data from steps
  const [patientData, setPatientData] = useState<any>(null)
  const [questionnaireData, setQuestionnaireData] = useState<any>(null)

  // Derived data
  const selectedService = services.find(s => s.id === serviceId)
  const selectedPractitioner = practitionerId === 'any' 
    ? { id: 'any', lastName: 'Premier disponible', title: '' } 
    : practitioners.find(p => p.id === practitionerId)
  
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''

  // Progress Calculation
  const stepOrder: Step[] = ['service', 'practitioner', 'date', 'slot', 'patient', 'questionnaire', 'payment', 'success']
  const progress = ((stepOrder.indexOf(currentStep)) / (stepOrder.length - 1)) * 100

  const handlePatientInfoComplete = (data: any) => {
    setPatientData(data)
    // Decide next step
    if (selectedService?.requiresQuestionnaire) {
      setCurrentStep('questionnaire')
    } else if (selectedService?.requiresDeposit && selectedService?.depositAmountCents) {
      setCurrentStep('payment')
    } else {
      // Final confirmation happens inside ConfirmStep if no other steps
      // But we can also move the actual creation to the end.
      // For now, let's assume ConfirmStep still does the creation if no other steps are needed.
    }
  }

  const handleQuestionnaireComplete = async (data: any) => {
    setQuestionnaireData(data)
    if (patientId) {
      const res = await saveMedicalQuestionnaireAction(tenantId, patientId, data)
      if (!res.success) {
        toast.error("Erreur lors de la sauvegarde du bilan médical")
        return
      }
      toast.success("Bilan médical enregistré")
    }

    if (selectedService?.requiresDeposit && selectedService?.depositAmountCents) {
      setCurrentStep('payment')
    } else {
      setCurrentStep('success')
    }
  }

  const handlePaymentComplete = () => {
    setCurrentStep('success')
  }

  if (currentStep === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100 animate-bounce">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <div className="space-y-4">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Rendez-vous confirmé !</h2>
           <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
              Votre demande a été enregistrée avec succès. Vous recevrez un courriel de confirmation et votre bilan médical a été transmis.
           </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <Link href="/">
              <Button className="h-14 px-8 rounded-2xl bg-slate-900 font-bold gap-2">
                 <Home className="h-5 w-5" /> Retour à l'accueil
              </Button>
           </Link>
           <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold gap-2" onClick={() => window.print()}>
              Imprimer le rappel
           </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Progress Tracker */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]" aria-hidden="true">Étape {stepOrder.indexOf(currentStep) + 1} sur {stepOrder.length - 1}</p>
              <h3 
                 className="text-lg font-black text-slate-900 uppercase tracking-tight"
                 aria-live="polite"
              >
                 {currentStep === 'service' && 'Choix du soin'}
                 {currentStep === 'practitioner' && 'Votre praticien'}
                 {currentStep === 'date' && 'Date du RDV'}
                 {currentStep === 'slot' && 'Heure du RDV'}
                 {currentStep === 'patient' && 'Vos informations'}
                 {currentStep === 'questionnaire' && 'Bilan médical'}
                 {currentStep === 'payment' && 'Garantie de réservation'}
              </h3>
           </div>
           <div className="text-right" aria-hidden="true">
              <span className="text-2xl font-black text-slate-200">{Math.round(progress)}%</span>
           </div>
        </div>
        <Progress value={progress} className="h-2 rounded-full bg-slate-100" aria-label={`Progression : ${Math.round(progress)}%`} />
      </div>

      {/* Steps Rendering */}
      <div className="min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentStep === 'service' && (
          <ServiceStep 
            services={services} 
            selectedId={serviceId} 
            onSelect={setServiceId} 
            onNext={() => setCurrentStep('practitioner')}
          />
        )}

        {currentStep === 'practitioner' && (
          <PractitionerStep 
            practitioners={practitioners} 
            selectedId={practitionerId} 
            onSelect={setPractitionerId} 
            onNext={() => setCurrentStep('date')}
            onBack={() => setCurrentStep('service')}
          />
        )}

        {currentStep === 'date' && (
          <CalendarStep 
            selectedDate={selectedDate} 
            onSelect={setSelectedDate} 
            onNext={() => setCurrentStep('slot')}
            onBack={() => setCurrentStep('practitioner')}
          />
        )}

        {currentStep === 'slot' && (
          <SlotsStep 
            tenantId={tenantId}
            serviceId={serviceId!}
            practitionerId={practitionerId!}
            date={formattedDate}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
            onNext={() => setCurrentStep('patient')}
            onBack={() => setCurrentStep('date')}
          />
        )}

        {currentStep === 'patient' && (
          <ConfirmStep 
            tenantId={tenantId}
            selection={{
              serviceId: serviceId!,
              serviceName: selectedService?.name || '',
              practitionerId: practitionerId!,
              practitionerName: selectedPractitioner ? `${selectedPractitioner.title} ${selectedPractitioner.lastName}` : '',
              date: formattedDate,
              slot: selectedSlot!
            }}
            onBack={() => setCurrentStep('slot')}
            onComplete={(id, pId) => {
              setAppointmentId(id)
              setPatientId(pId || null)
              if (selectedService?.requiresQuestionnaire) {
                setCurrentStep('questionnaire')
              } else if (selectedService?.requiresDeposit) {
                setCurrentStep('payment')
              } else {
                setCurrentStep('success')
              }
            }}
          />
        )}

        {currentStep === 'questionnaire' && (
           <QuestionnaireStep 
             onBack={() => setCurrentStep('patient')}
             onNext={handleQuestionnaireComplete}
           />
        )}

        {currentStep === 'payment' && (
           <PaymentStep 
             amount={selectedService?.depositAmountCents || 5000}
             onBack={() => selectedService?.requiresQuestionnaire ? setCurrentStep('questionnaire') : setCurrentStep('patient')}
             onPay={handlePaymentComplete}
           />
        )}
      </div>

      {/* Trust Footer */}
      <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
         <div className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
               {selectedService?.requiresDeposit ? 'Paiement sécurisé par Stripe' : 'Paiement sécurisé sur place'}
            </p>
         </div>
         <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Modification possible 24h avant</p>
         </div>
      </div>
    </div>
  )
}
