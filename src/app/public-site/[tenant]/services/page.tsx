import { 
  Stethoscope, 
  Baby, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Search, 
  ArrowRight,
  Microscope,
  Ear
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: <Stethoscope className="h-6 w-6" />,
    title: "Examens & Nettoyage",
    description: "Prévention complète et nettoyage professionnel pour maintenir votre santé buccale.",
    price: "À partir de 120$"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Blanchiment Dentaire",
    description: "Retrouvez l'éclat de votre sourire avec nos technologies de blanchiment au laser.",
    price: "Offre: 299$"
  },
  {
    icon: <Baby className="h-6 w-6" />,
    title: "Dentisterie Pédiatrique",
    description: "Des soins doux et ludiques pour les plus petits. Une approche sans peur.",
    price: "Consultation"
  },
  {
    icon: <Microscope className="h-6 w-6" />,
    title: "Orthodontie",
    description: "Alignement parfait via Invisalign ou appareils traditionnels.",
    price: "Plan gratuit"
  },
  {
    icon: <Ear className="h-6 w-6" />,
    title: "Chirurgie Buccale",
    description: "Extractions, implants et soins spécialisés avec sédation disponible.",
    price: "Expertise"
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Urgences & Réparation",
    description: "Couronnes, ponts et réparations rapides pour vos situations critiques.",
    price: "Priorité"
  }
]

export default function ServicesPage() {
  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Nos Soins & Services</h1>
          <p className="text-xl text-slate-500">Une approche technologique au service de votre bien-être bucco-dentaire.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div 
              key={i} 
              className="group bg-white p-10 rounded-[2rem] border-2 border-transparent hover:border-primary/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                {service.description}
              </p>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                 <span className="text-xs font-black uppercase tracking-widest text-slate-400">{service.price}</span>
                 <Button variant="ghost" className="text-primary font-bold group-hover:translate-x-1 transition-transform">
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-card p-12 rounded-[3rem] text-center space-y-6">
           <h2 className="text-3xl font-black text-slate-900 text-glow">Vous avez un besoin spécifique ?</h2>
           <p className="text-slate-500 max-w-xl mx-auto">Nos spécialistes sont là pour établir un plan de traitement personnalisé adapté à vos besoins et votre budget.</p>
           <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold">
              Consulter un professionnel
           </Button>
        </div>
      </div>
    </div>
  )
}
