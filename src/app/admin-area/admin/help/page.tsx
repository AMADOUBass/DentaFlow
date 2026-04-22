import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  Users,
  MessageCircle,
  HelpCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function HelpCenterPage() {
  const categories = [
    {
      title: 'Démarrage Rapide',
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      items: [
        'Configurer les horaires de la clinique',
        'Ajouter votre premier praticien',
        'Personnaliser vos emails de rappel'
      ]
    },
    {
      title: 'Gestion des Patients',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      items: [
        'Créer un nouveau dossier patient',
        'Utiliser l\'odonthogramme interactif',
        'Uploader des radiographies'
      ]
    },
    {
      title: 'Facturation & RAMQ',
      icon: <CreditCard className="h-6 w-6 text-emerald-500" />,
      items: [
        'Générer une facture ACDQ',
        'Gérer le partage avec les assureurs',
        'Suivre les paiements impayés'
      ]
    },
    {
      title: 'Sécurité (Loi 25)',
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      items: [
        'Consulter les logs d\'audit',
        'Droit à l\'oubli (Suppression)',
        'Rapport de confidentialité annuel'
      ]
    }
  ]

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-10">
      {/* Search Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
           <HelpCircle className="h-4 w-4" /> Centre de Support
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Comment pouvons-nous <br /> vous <span className="text-primary">aider aujourd'hui ?</span>
        </h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-4 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Rechercher un tutoriel, un article ou un guide..." 
            className="w-full h-14 pl-14 rounded-3xl border-none shadow-2xl shadow-slate-200 text-lg font-medium"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Card key={cat.title} className="border-none shadow-xl shadow-slate-100 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-white transition-colors">
                   {cat.icon}
                 </div>
                 <h2 className="text-xl font-black text-slate-900">{cat.title}</h2>
              </div>
              <div className="space-y-3">
                 {cat.items.map((item) => (
                   <div key={item} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors cursor-pointer">
                      <span className="text-sm font-bold text-slate-600">{item}</span>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                   </div>
                 ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Banner */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Besoin d'une assistance directe ?</h2>
          <p className="text-slate-400 max-w-md mx-auto font-medium">
            Notre équipe de support basée au Québec est disponible du lundi au vendredi, de 8h à 17h.
          </p>
          <div className="pt-4">
            <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-black text-lg hover:bg-slate-100 gap-3">
              Contacter le support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
