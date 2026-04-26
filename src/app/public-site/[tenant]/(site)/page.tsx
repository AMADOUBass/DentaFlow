import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  MapPin,
  Clock,
  Star,
  CalendarCheck,
  Users,
  Sparkles,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { getLocaleServer } from "@/lib/i18n-server";
import { getTenantPath, getTenant } from "@/lib/tenant";
import NextImage from "next/image";
import { notFound } from "next/navigation";
import { I18nLink } from "@/components/I18nLink";

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const locale = await getLocaleServer();
  const t = useTranslations(locale);
  const tenantData = await getTenant();
  
  if (!tenantData) return notFound();
  
  const clinicName = tenantData.name;

  return (
    <div className="flex flex-col relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>

      {/* HERO SECTION - Clinical Focus */}
      <section className="relative pt-12 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3 fill-primary" />{" "}
                {t.clinic_home.badge}
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                {t.clinic_home.hero_title_part1} <br />
                <span className="text-primary italic text-glow">
                  {t.clinic_home.hero_title_accent}
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                {locale === "fr"
                  ? `Bienvenue au Centre ${clinicName}. `
                  : `Welcome to the ${clinicName} Center. `}
                {t.clinic_home.hero_desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <I18nLink href="/rendez-vous">
                  <Button
                    size="lg"
                    className="h-14 px-10 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 group">
                    {t.common.book}{" "}
                    <CalendarCheck className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </I18nLink>
                <div className="flex items-center gap-4 px-6 border-l-2 border-slate-200">
                  <div className="flex -space-x-2">
                    {tenantData.practitioners.slice(0, 3).map((p, idx) => (
                       <div key={p.id} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                          {p.photoUrl ? (
                            <NextImage src={p.photoUrl} alt={p.lastName} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-[10px]">
                               {p.firstName[0]}{p.lastName[0]}
                            </div>
                          )}
                       </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold shadow-lg" aria-label="Et d'autres membres de l'équipe">
                       +{Math.max(0, tenantData.practitioners.length - 3 + 5)}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest line-clamp-1">
                    {t.clinic_home.patients_count}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative group">
                <NextImage 
                  src="/assets/images/patient-trust.png" 
                  alt={`Intérieur moderne et accueillant de la clinique ${clinicName} à Montréal`} 
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white font-black text-2xl tracking-tight">Oros {clinicName}</p>
                  <p className="text-white/80 text-sm font-medium">Technologie de pointe & Soins humains</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute top-10 -left-10 glass-card p-5 rounded-3xl space-y-1 animate-in zoom-in duration-1000 delay-300">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm font-black text-slate-900 leading-none">
                  4.9/5 {t.clinic_home.reviews}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INFO BAR */}
      <section className="bg-white py-12 border-y">
        <div className="container mx-auto px-4">
          <h2 className="sr-only">Informations pratiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <MapPin className="text-primary" />,
                title: t.clinic_home.location,
                info: `${tenantData.address}, ${tenantData.city}`
              },
              {
                icon: <Clock className="text-primary" />,
                title: t.clinic_home.hours,
                info: (() => {
                  const todayBH = tenantData.businessHours.find(bh => bh.weekday === new Date().getDay())
                  if (!todayBH || todayBH.closed) return locale === 'fr' ? 'Fermé aujourd\'hui' : 'Closed today'
                  return `${todayBH.openTime} – ${todayBH.closeTime}`
                })()
              },
              {
                icon: <Activity className="text-primary" />,
                title: t.clinic_home.emergency_support,
                info: t.clinic_home.emergency_desc,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5 p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-900 font-bold leading-tight">{item.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
            {t.clinic_home.cta_title_part1} <br />{" "}
            {t.clinic_home.cta_title_accent}
            <span className="text-primary italic">
              {t.clinic_home.cta_title_part2}
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <I18nLink href="/services">
              <Button
                variant="outline"
                className="h-16 px-10 text-lg font-bold rounded-2xl border-2 hover:bg-slate-50 transition-all group">
                {t.common.services}{" "}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </I18nLink>
            <I18nLink href="/urgences">
              <Button
                variant="destructive"
                className="h-16 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-rose-200">
                {t.clinic_home.manage_emergency}
              </Button>
            </I18nLink>
          </div>
        </div>
      </section>
      {/* MAP SECTION */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                <MapPin className="h-3 w-3" /> {t.clinic_home.location}
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Venez nous <span className="text-primary italic">voir</span></h2>
             <p className="text-xl text-slate-500 font-medium">Située au cœur de Montréal, notre clinique est facilement accessible.</p>
          </div>

          <div className="relative group">
             <div className="h-[500px] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${tenantData.address}, ${tenantData.city}, ${tenantData.province} ${tenantData.postalCode}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                ></iframe>
                
                {/* Overlay Info Card */}
                <div className="absolute bottom-10 left-10 right-10 md:right-auto md:w-[350px] p-8 glass-card rounded-[2.5rem] border-white/60 shadow-2xl space-y-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                         <MapPin className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{clinicName}</h3>
                   </div>
                   <p className="text-slate-600 font-bold leading-relaxed text-sm">
                      {tenantData.address}<br />
                      {tenantData.city}, {tenantData.province} {tenantData.postalCode}
                   </p>
                   <div className="pt-2">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${tenantData.address}, ${tenantData.city}, ${tenantData.province} ${tenantData.postalCode}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform"
                      >
                         Ouvrir dans Google Maps <ArrowRight className="h-3 w-3" />
                      </a>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
