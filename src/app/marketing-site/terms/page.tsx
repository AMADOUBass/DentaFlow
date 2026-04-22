import { FileText, CheckCircle, AlertCircle, Scale, CreditCard, ShieldAlert } from 'lucide-react'
import { getLocaleServer, useTranslations } from '@/lib/i18n'

export default async function TermsPage() {
  const locale = await getLocaleServer()
  const t = useTranslations(locale)

  const terms = [
    {
      title: "Navigation & Acceptation",
      icon: <Scale className="h-6 w-6 text-primary" />,
      content: "En accédant à ce site web ou en utilisant la plateforme Oros, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et acceptez que vous êtes responsable du respect des lois locales applicables."
    },
    {
      title: "Licence d'utilisation",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      content: "L'accès à la plateforme Oros est concédé sous forme de licence SaaS (Software as a Service) non exclusive et non transférable. Cette licence est strictement réservée à l'usage professionnel au sein de votre centre dentaire identifié lors de l'inscription."
    },
    {
      title: "Paiements & Abonnements",
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      content: "Les abonnements sont facturés mensuellement ou annuellement à l'avance. Tout défaut de paiement peut entraîner une suspension temporaire de l'accès à vos données cliniques conformément aux termes de votre contrat."
    },
    {
      title: "Limitation de responsabilité",
      icon: <ShieldAlert className="h-6 w-6 text-primary" />,
      content: "Bien qu'Oros s'efforce de maintenir une disponibilité de 99.9%, nous ne pouvons être tenus responsables des interruptions de service dues à des facteurs externes ou à la maintenance programmée. L'utilisation clinique des outils d'aide au diagnostic (comme l'odonthogramme) demeure sous l'entière responsabilité du praticien."
    }
  ]

  return (
    <div className="py-20 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="space-y-6 mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full text-white text-xs font-black uppercase tracking-widest">
            <FileText className="h-3 w-3" /> Accord Légal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Conditions <span className="text-primary italic">d'Utilisation</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Veuillez lire attentivement ces termes avant d'utiliser la plateforme DentaFlow.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
           <div className="p-12 space-y-16">
              {terms.map((term, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      {term.icon}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{term.title}</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium pl-14">
                    {term.content}
                  </p>
                </div>
              ))}
           </div>
           
           <div className="bg-slate-900 p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                 <AlertCircle className="h-8 w-8 text-primary" />
                 <div>
                    <h3 className="font-black text-xl">Délai de résiliation</h3>
                    <p className="text-slate-400 font-medium">Contrat sans engagement, préavis de 30 jours.</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 transition-transform">
                 Télécharger le PDF
              </button>
           </div>
        </div>

        <p className="text-center mt-12 text-slate-400 text-xs font-medium italic">
          Oros est une marque déposée de DentaFlow Solutions Inc. © 2026.
        </p>
      </div>
    </div>
  )
}
