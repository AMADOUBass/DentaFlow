import { Card, CardContent } from '@/components/ui/card'
import { Settings, Lock, CreditCard, ChevronRight, Bell, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function SettingsRootPage() {
  const settingsCategories = [
    {
      title: "Informations Cliniques",
      desc: "Gérez l'identité, le logo et les coordonnées.",
      href: "/admin/settings/general",
      icon: Settings,
      color: "text-slate-900",
      bg: "bg-slate-100"
    },
    {
      title: "Sécurité & Loi 25",
      desc: "Gestion de la confidentialité et audit logs.",
      href: "/admin/settings/security",
      icon: Lock,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Facturation & Plan",
      desc: "Gérez votre abonnement et vos factures.",
      href: "/admin/settings/billing",
      icon: CreditCard,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Notifications",
      desc: "Préférences des rappels SMS et emails.",
      href: "#",
      icon: Bell,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Application Mobile",
      desc: "Paramètres de votre présence mobile.",
      href: "#",
      icon: Smartphone,
      color: "text-sky-600",
      bg: "bg-sky-50"
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Configuration</h1>
        <p className="text-slate-500 mt-1">Gérez les paramètres globaux de votre clinique.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((cat, i) => (
          <Link key={i} href={cat.href}>
            <Card className="border-none shadow-sm rounded-[2rem] hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 group cursor-pointer border border-slate-100 h-full">
              <CardContent className="p-8 h-full flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <cat.icon className={`h-7 w-7 ${cat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{cat.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{cat.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
