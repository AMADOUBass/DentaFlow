import { Shield, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Politique de Confidentialité</h1>
        <p className="text-slate-500 font-medium italic">Dernière mise à jour : 22 avril 2026</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Shield className="h-6 w-6" />
            <h2 className="text-2xl font-black m-0">Engagement Loi 25</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé (Loi 25), 
            <strong> Oros Systems Inc.</strong> s'engage à protéger l'intégrité et la confidentialité des données 
            dentaires et personnelles traitées sur sa plateforme.
          </p>
        </section>

        <section className="space-y-4 p-8 bg-slate-50 rounded-[2rem]">
          <h3 className="text-xl font-bold text-slate-900">1. Collecte des données</h3>
          <p className="text-slate-600">
            Nous collectons les renseignements strictement nécessaires à la prestation de soins dentaires :
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Identité (Nom, Prénom, Date de naissance)</li>
            <li>Coordonnées (Email, Téléphone, Adresse)</li>
            <li>Numéro de RAMQ (Chiffré de bout en bout)</li>
            <li>Notes médicales et Odonthogrammes</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-600">
            <Lock className="h-6 w-6" />
            <h3 className="text-xl font-bold m-0">2. Sécurité et Chiffrement</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Toutes les données sensibles sont chiffrées à l'aide de l'algorithme <strong>AES-256-GCM</strong>. 
            Les serveurs de données sont situés physiquement au <strong>Canada (Région Québec/Ontario)</strong> 
            pour garantir la souveraineté des données de santé des citoyens québécois.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-blue-600">
            <Eye className="h-6 w-6" />
            <h3 className="text-xl font-bold m-0">3. Droit d'accès et d'effacement</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Tout patient dispose d'un droit d'accès, de rectification et de suppression de ses données (Droit à l'oubli). 
            Les demandes peuvent être adressées directement au responsable de la protection des renseignements personnels 
            de votre clinique dentaire.
          </p>
        </section>
      </div>

      <div className="pt-10 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Responsable de la protection des données : privacy@Oros.ca</p>
      </div>
    </div>
  )
}
