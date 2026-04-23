import { FileText, Scale, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Conditions d'Utilisation</h1>
        <p className="text-slate-500 font-medium italic">En vigueur le 22 avril 2026</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-slate-900">
            <Scale className="h-6 w-6" />
            <h2 className="text-2xl font-black m-0">1. Acceptation des termes</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            En utilisant la plateforme Oros, vous acceptez d'être lié par les présentes conditions. 
            Oros est un logiciel de gestion clinique destiné aux professionnels de la santé dentaire.
          </p>
        </section>

        <section className="space-y-4 p-8 bg-slate-50 rounded-[2rem]">
          <h3 className="text-xl font-bold text-slate-900">2. Responsabilité Clinique</h3>
          <p className="text-slate-600">
            La clinique utilisatrice (le "Tenant") est seule responsable de l'exactitude des données saisies et de 
            la validation des soins prodigués. Oros agit en tant que fournisseur technologique et ne peut être 
            tenu responsable des décisions cliniques.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <CheckCircle2 className="h-6 w-6" />
            <h3 className="text-xl font-bold m-0">3. Abonnement et Paiement</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Les frais d'abonnement SaaS sont facturés mensuellement via Stripe. Tout retard de paiement de plus de 
            30 jours peut entraîner une suspension temporaire de l'accès à l'interface d'administration, sans 
            perte de données.
          </p>
        </section>

        <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
           <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
           <p className="text-sm text-amber-800 font-medium leading-relaxed m-0">
             <strong>Avis important :</strong> En cas de résiliation, la clinique dispose d'un délai de 90 jours pour 
             exporter l'intégralité de ses dossiers patients (export JSON/PDF) avant la suppression définitive 
             des données.
           </p>
        </div>
      </div>
    </div>
  )
}
