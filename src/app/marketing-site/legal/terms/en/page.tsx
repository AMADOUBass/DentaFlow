import { Scale, CheckCircle2, AlertCircle } from 'lucide-react'

export default function TermsOfServicePageEn() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-slate-500 font-medium italic">Effective Date: April 22, 2026</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-slate-900">
            <Scale className="h-6 w-6" />
            <h2 className="text-2xl font-black m-0">1. Acceptance of Terms</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            By using the DentaFlow platform, you agree to be bound by these terms. 
            DentaFlow is a clinical management software intended for dental health professionals.
          </p>
        </section>

        <section className="space-y-4 p-8 bg-slate-50 rounded-[2rem]">
          <h3 className="text-xl font-bold text-slate-900">2. Clinical Responsibility</h3>
          <p className="text-slate-600">
            The using clinic (the "Tenant") is solely responsible for the accuracy of the data entered and the 
            validation of the care provided. DentaFlow acts as a technology provider and cannot be held 
            responsible for clinical decisions.
          </p>
        </section>

        <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
           <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
           <p className="text-sm text-amber-800 font-medium leading-relaxed m-0">
             <strong>Important Notice:</strong> In the event of termination, the clinic has 90 days to export 
             all of its patient records (JSON/PDF export) before the final deletion of data.
           </p>
        </div>
      </div>
    </div>
  )
}
