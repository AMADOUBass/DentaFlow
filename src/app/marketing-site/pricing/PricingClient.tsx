'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  HelpCircle,
  Zap,
  Shield,
  Crown,
  Gift,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { useTranslations, Locale } from '@/lib/i18n'
import { I18nLink } from '@/components/I18nLink'
import { cn } from '@/lib/utils'

export function PricingClient({ locale }: { locale: Locale }) {
  const t = useTranslations(locale)
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      key: 'essentiel' as const,
      icon: Zap,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      featured: false,
      cta: t.pricing_page.plans.essentiel.cta,
      href: '/register',
    },
    {
      key: 'complet' as const,
      icon: Shield,
      iconBg: 'bg-primary',
      iconColor: 'text-white',
      featured: true,
      cta: t.pricing_page.plans.complet.cta,
      href: '/register',
    },
    {
      key: 'premium' as const,
      icon: Crown,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      featured: false,
      cta: t.pricing_page.plans.premium.cta,
      href: '/contact',
    },
  ]

  const tp = t.pricing_page
  const tpf = t.pricing_faq

  return (
    <div className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* ─── HEADER ─── */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
          {/* Free Trial Badge */}
          <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-2.5 rounded-full">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-black">{t.pricing_preview.trial_badge}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">
            {tp.hero_title}
            <span className="text-primary italic">{tp.hero_accent}</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            {tp.hero_subtitle}
          </p>

          {/* ─── BILLING TOGGLE ─── */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={cn(
              "text-sm font-black uppercase tracking-widest transition-colors",
              !annual ? "text-slate-900" : "text-slate-400"
            )}>
              {tp.billing_monthly}
            </span>

            <button
              onClick={() => setAnnual(v => !v)}
              aria-label="Basculer facturation annuelle"
              className={cn(
                "relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                annual ? "bg-primary" : "bg-slate-200"
              )}
            >
              <span className={cn(
                "inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform",
                annual ? "translate-x-8" : "translate-x-1"
              )} />
            </button>

            <span className={cn(
              "text-sm font-black uppercase tracking-widest transition-colors flex items-center gap-2",
              annual ? "text-slate-900" : "text-slate-400"
            )}>
              {tp.billing_annual}
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                <Sparkles className="h-2.5 w-2.5" />
                {tp.annual_savings}
              </span>
            </span>
          </div>
        </div>

        {/* ─── PRICING GRID ─── */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto lg:items-center">
          {plans.map((plan) => {
            const data = tp.plans[plan.key]
            const price = annual ? data.price_annual : data.price_monthly
            const suffix = annual ? tp.annual_suffix : tp.monthly_suffix
            const Icon = plan.icon

            if (plan.featured) {
              return (
                <div key={plan.key} className="relative group lg:scale-110 order-first lg:order-none">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-primary blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity rounded-[3rem]" />
                  <div className="relative glass-card p-12 rounded-[3rem] border-2 border-primary bg-white space-y-8 shadow-2xl shadow-primary/20">
                    {/* Badge */}
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                      {t.pricing_preview.popular}
                    </div>

                    {/* Icon + Name */}
                    <div className="space-y-3">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20", plan.iconBg)}>
                        <Icon className={cn("h-7 w-7", plan.iconColor)} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900">{data.name}</h3>
                      <p className="text-sm text-slate-500 font-bold">{data.desc}</p>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-black text-slate-900 tabular-nums">${price}</span>
                        <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">{suffix}</span>
                      </div>
                      {annual && (
                        <p className="text-[11px] text-slate-400 font-bold">
                          {locale === 'fr' ? 'soit ' : 'or '}<span className="text-primary font-black">{Math.round(parseInt(data.price_annual.replace(/[ ,]/g, '')) / 12)}$</span>{tp.monthly_suffix}
                        </p>
                      )}
                      <p className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                        <Gift className="h-3 w-3" /> {locale === 'fr' ? '14 jours gratuits · puis facturation' : '14 days free · then billed'}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4">
                      {(data.features as string[]).map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <I18nLink href={plan.href} className="block">
                      <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-base shadow-xl hover:bg-slate-800 transition-all active:scale-95 group/btn">
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </I18nLink>
                  </div>
                </div>
              )
            }

            // Non-featured cards
            return (
              <div key={plan.key} className="glass-card p-10 rounded-[2.5rem] border border-slate-200 space-y-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-white">
                {/* Icon + Name */}
                <div className="space-y-3">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", plan.iconBg)}>
                    <Icon className={cn("h-6 w-6", plan.iconColor)} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{data.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{data.desc}</p>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 tabular-nums">${price}</span>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{suffix}</span>
                  </div>
                  {annual && (
                    <p className="text-[11px] text-slate-400 font-bold">
                      {locale === 'fr' ? 'soit ' : 'or '}<span className="text-primary font-black">{Math.round(parseInt(data.price_annual.replace(/[ ,]/g, '')) / 12)}$</span>{tp.monthly_suffix}
                    </p>
                  )}
                  <p className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                    <Gift className="h-3 w-3" /> {locale === 'fr' ? '14 jours gratuits · sans carte' : '14 days free · no card'}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {(data.features as string[]).map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <I18nLink href={plan.href} className="block">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-black hover:border-primary/40 hover:text-primary transition-all">
                    {plan.cta}
                  </Button>
                </I18nLink>
              </div>
            )
          })}
        </div>

        {/* ─── ANNUAL PROMO BANNER ─── */}
        {!annual && (
          <div className="mt-12 max-w-2xl mx-auto">
            <button
              onClick={() => setAnnual(true)}
              className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all group"
            >
              <Sparkles className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-black text-emerald-700">
                {tp.annual_promo}
              </span>
            </button>
          </div>
        )}

        {/* ─── FAQ ─── */}
        <div className="mt-40 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900">{tpf.title}</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{tpf.badge}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { q: tpf.q1, a: tpf.a1 },
              { q: tpf.q2, a: tpf.a2 },
              { q: tpf.q3, a: tpf.a3 },
              { q: tpf.q4, a: tpf.a4 },
              { q: tpf.q5, a: tpf.a5 },
              { q: tpf.q6, a: tpf.a6 },
            ].map((faq, i) => (
              <div key={i} className="space-y-3 p-8 bg-white rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <h4 className="font-black text-slate-900 tracking-tight">{faq.q}</h4>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
