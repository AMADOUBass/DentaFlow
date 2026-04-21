import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Sparkles, Clock, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function MessagesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Centre de Messages</h1>
          <p className="text-slate-500 mt-1">Gérez vos communications avec les patients.</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 h-10 rounded-xl font-bold gap-2">
          <ShieldCheck className="h-4 w-4" /> Sécurisé de bout en bout
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 relative">
                 <MessageSquare className="h-10 w-10 text-slate-300" />
                 <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                    <Sparkles className="h-4 w-4 text-white" />
                 </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Moteur de Réservation IA</h2>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed mb-8">
                Votre centre de messages est en cours de synchronisation avec le moteur de réservation intelligent. 
                Bientôt, vous pourrez automatiser vos réponses et les confirmations par SMS.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-primary font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200">
                <Clock className="h-4 w-4" /> Prochainement Disponible
              </div>
           </Card>
        </div>

        <div className="space-y-6">
           <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] ml-4">Statistiques</h3>
           <Card className="border-none shadow-sm rounded-3xl p-6 bg-white border border-slate-100">
              <CardContent className="p-0 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-600">SMS Envoyés</span>
                    <span className="text-lg font-black text-slate-900">0</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary w-[5%] h-full rounded-full" />
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
