import { getTenant } from '@/lib/tenant'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Stethoscope, GraduationCap, Award, Mail } from 'lucide-react'
import NextImage from 'next/image'

export default async function EquipePage() {
  const tenant = await getTenant()

  if (!tenant) {
    return notFound()
  }

  const practitioners = tenant.practitioners

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <Award className="h-3 w-3" /> Expertise & Dévouement
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
            Notre <span className="text-primary italic">Équipe</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Des professionnels passionnés engagés à vous offrir les meilleurs soins dentaires au Québec.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {practitioners.map((practitioner, i) => (
            <Card 
              key={practitioner.id} 
              className="group relative overflow-hidden rounded-[2.5rem] border-slate-100/50 bg-white hover:border-primary/20 hover:shadow-[0_30px_60px_rgba(15,118,110,0.12)] transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                {practitioner.photoUrl ? (
                  <NextImage 
                    src={practitioner.photoUrl} 
                    alt={`${practitioner.title} ${practitioner.lastName}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Stethoscope className="w-20 h-20 opacity-20" />
                  </div>
                )}
                
                {/* Overlay Name Tag */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <p className="text-white font-black text-xl leading-tight">
                      {practitioner.title} {practitioner.firstName} {practitioner.lastName}
                   </p>
                   <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">
                      {practitioner.specialty || 'Spécialiste'}
                   </p>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                        {practitioner.title} {practitioner.lastName}
                      </h3>
                      <p className="text-xs font-black text-primary uppercase tracking-widest mt-1">
                        {practitioner.specialty || 'Dentisterie Générale'}
                      </p>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <GraduationCap className="w-5 h-5" />
                   </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {practitioner.bio || "Professionnel dévoué au service de la santé bucco-dentaire de nos patients avec les technologies les plus avancées."}
                </p>

                <div className="pt-4 flex border-t border-slate-50 gap-4">
                   <button className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-primary transition-colors">
                      Prendre RDV
                   </button>
                   <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
                      <Mail className="w-5 h-5" />
                   </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {practitioners.length === 0 && (
          <div className="text-center py-20 glass-card rounded-[2.5rem] border-dashed border-2 border-slate-200">
            <p className="text-slate-400 font-bold italic">L'équipe est en cours de constitution.</p>
          </div>
        )}
      </div>
    </div>
  )
}
