import { Shield, Lock, Eye, FileText, Database, Globe, UserCheck } from 'lucide-react'
import { getLocaleServer, useTranslations } from '@/lib/i18n'

export default async function PrivacyPage() {
  const locale = await getLocaleServer()
  const t = useTranslations(locale)

  const sections = [
    {
      title: "Introduction",
      icon: <Shield className="h-6 w-6 text-primary" />,
      content: "Chez Oros, nous prenons la protection de vos renseignements personnels et de ceux de vos patients très au sérieux. Cette politique détaille comment nous collectons, utilisons et protégeons vos données dans le cadre de notre plateforme de gestion dentaire multi-tenant."
    },
    {
      title: "Conformité Loi 25",
      icon: <Lock className="h-6 w-6 text-primary" />,
      content: "Oros est entièrement conforme à la Loi 25 du Québec. Toutes les données sont hébergées sur des serveurs sécurisés situés au Canada (région Québec/Ontario). Nous maintenons des journaux d'audit rigoureux pour toute consultation de données de santé."
    },
    {
      title: "Collecte des données",
      icon: <Database className="h-6 w-6 text-primary" />,
      content: "Nous collectons uniquement les informations nécessaires au bon fonctionnement de votre clinique : données d'identification des patients, historiques de soins, et informations de facturation. Ces données vous appartiennent exclusivement."
    },
    {
      title: "Vos droits",
      icon: <UserCheck className="h-6 w-6 text-primary" />,
      content: "Vous et vos patients disposez d'un droit d'accès, de rectification et de suppression (droit à l'oubli). Notre plateforme inclut des outils d'exportation de données au format JSON pour assurer la portabilité des renseignements."
    }
  ]

  return (
    <div className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="space-y-6 mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary text-xs font-black uppercase tracking-widest">
            <Lock className="h-3 w-3" /> Sécurité Maximale
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Politique de <span className="text-primary italic">Confidentialité</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Dernière mise à jour : 19 avril 2026. Comment nous protégeons l'intégrité de votre pratique dentaire.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 items-start group">
              <div className="flex-shrink-0 w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                {section.icon}
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                <p className="text-slate-600 leading-relaxed font-medium text-lg">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Legal Text Placeholder */}
        <div className="mt-24 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8">
          <div className="flex items-center gap-3">
             <FileText className="h-6 w-6 text-slate-400" />
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Responsable de la protection</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Officier Loi 25 (Oros)</p>
                <p className="font-bold text-slate-900">Amadou Bass</p>
                <p className="text-sm text-slate-500 font-medium">privacy@oros.ca</p>
             </div>
             <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Hébergement</p>
                <p className="font-bold text-slate-900">Supabase Canada</p>
                <p className="text-sm text-slate-500 font-medium">Région : ca-central-1 (Canada Central)</p>
             </div>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed border-t border-slate-200 pt-8">
            Note : En tant que fournisseur de services technologiques, Oros agit à titre de sous-traitant des données pour les cliniques dentaires. Chaque clinique demeure responsable du traitement des données de ses propres patients.
          </p>
        </div>
      </div>
    </div>
  )
}
