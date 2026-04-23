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
} from "lucide-react";
import { useTranslations } from '@/lib/i18n'
import { getLocaleServer } from '@/lib/i18n-server'
import { I18nLink } from "@/components/I18nLink";

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const locale = await getLocaleServer();
  const t = useTranslations(locale);
  const clinicName = tenant.charAt(0).toUpperCase() + tenant.slice(1);

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
                    <img src="/demo/dr-dante.png" alt="Dr Dante Alighieri, dentiste généraliste chez Oros" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    <img src="/demo/dre-beatrice.png" alt="Dre Beatrice Portinari, orthodontiste chez Oros" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary" aria-label="Et 8 autres membres de l'équipe">+8</div>
                  </div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest line-clamp-1">
                    {t.clinic_home.patients_count}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative group">
                <img 
                  src="/assets/images/patient-trust.png" 
                  alt={`Intérieur moderne et accueillant de la clinique ${clinicName} à Montréal`} 
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
                info:
                  locale === "fr"
                    ? "123 Rue de la Santé, Québec"
                    : "123 Health St, Quebec City",
              },
              {
                icon: <Clock className="text-primary" />,
                title: t.clinic_home.hours,
                info:
                  locale === "fr" ? "Lun-Ven: 8h - 18h" : "Mon-Fri: 8am - 6pm",
              },
              {
                icon: <Clock className="text-primary" />,
                title: t.clinic_home.emergency_support,
                info: t.clinic_home.emergency_desc,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-medium">{item.info}</p>
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
    </div>
  );
}
