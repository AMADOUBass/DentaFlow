import { Check, Shield, Zap, Crown, ArrowRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { startSubscriptionAction } from '@/server/billing'

export default function TrialExpiredPage() {
  const plans = [
    {
      name: 'Essentiel',
      price: '149',
      description: 'Pour les nouveaux cabinets dentaires.',
      priceId: 'price_essential_id', // Placeholder, you should replace this with real Stripe Price ID
      icon: Zap,
      color: 'bg-blue-50 text-blue-600',
      features: [
        'Prise de RDV en ligne',
        'Agenda intelligent',
        'Rappels SMS (limités)',
        '1 Praticien inclus',
        'Support email'
      ]
    },
    {
      name: 'Complet',
      price: '399',
      description: 'L\'outil idéal pour les cliniques en croissance.',
      priceId: 'price_complet_id', // Placeholder, you should replace this with real Stripe Price ID
      icon: Shield,
      color: 'bg-primary/10 text-primary',
      recommended: true,
      features: [
        'Tout le forfait Essentiel',
        'Jusqu\'à 3 praticiens',
        'Portail Patient premium',
        'Rappels SMS illimités',
        'Gestion des urgences IA',
        'Support prioritaire'
      ]
    },
    {
      name: 'Premium',
      price: '899',
      description: 'Performance maximale pour centres multi-dentistes.',
      priceId: 'price_premium_id', // Placeholder, you should replace this with real Stripe Price ID
      icon: Crown,
      color: 'bg-amber-50 text-amber-600',
      features: [
        'Tout le forfait Complet',
        'Praticiens illimités',
        'Statistiques avancées',
        'Multi-clinique',
        'Support dédié 24/7',
        'Accès API Oros'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
             Votre période d'essai est <span className="text-rose-600">terminée.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
             Nous espérons que vous avez apprécié Oros. Pour continuer à gérer votre clinique et conserver vos données, veuillez choisir un forfait ci-dessous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative border-none rounded-[2.5rem] shadow-xl transition-all duration-500 hover:scale-[1.02] ${plan.recommended ? 'ring-4 ring-primary shadow-primary/20' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Plus populaire
                </div>
              )}
              <CardHeader className="pt-10 px-8">
                <div className={`w-14 h-14 rounded-2xl ${plan.color} flex items-center justify-center mb-6`}>
                   <plan.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-3xl font-black text-slate-900">{plan.name}</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500 mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="px-8 py-6">
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 font-bold">/mois</span>
                </div>
                <div className="space-y-4">
                   {plan.features.map((feature) => (
                     <div key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                           <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                     </div>
                   ))}
                </div>
              </CardContent>
              <CardFooter className="pb-10 px-8">
                <form action={startSubscriptionAction.bind(null, plan.priceId)} className="w-full">
                  <Button 
                    className={`w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-lg transition-all ${plan.recommended ? 'bg-primary shadow-primary/20' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'}`}
                  >
                    Activer mon abonnement
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
