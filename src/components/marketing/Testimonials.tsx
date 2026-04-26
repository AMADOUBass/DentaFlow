'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TestimonialItem {
  name: string
  role: string
  clinic: string
  content: string
}

interface TestimonialsProps {
  title: string
  subtitle: string
  items: TestimonialItem[]
}

export function Testimonials({ title, subtitle, items }: TestimonialsProps) {
  return (
    <section className="py-40 relative overflow-hidden bg-white">
      {/* Background Decor - Refined */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px] opacity-40" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto mb-24 space-y-5">
          <Badge variant="outline" className="px-3 py-1 rounded-full border-primary/30 text-primary font-black uppercase tracking-widest text-[9px]">
            Témoignages
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
            Ils font confiance à <span className="text-primary italic">Oros</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map((item, i) => (
            <div 
              key={i} 
              className="group relative bg-slate-50/50 p-12 rounded-[4rem] border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-[0_40px_80px_-15px_rgba(15,118,110,0.1)] transition-all duration-500 hover:-translate-y-4 flex flex-col"
            >
              <div className="absolute -top-8 -left-2 w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-12 group-hover:rotate-0 transition-all duration-500 group-hover:scale-110">
                <Quote className="h-8 w-8 text-white" />
              </div>

              <div className="flex gap-1.5 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                ))}
              </div>

              <p className="text-slate-700 text-xl font-medium leading-relaxed italic flex-grow mb-12">
                "{item.content}"
              </p>

              <div className="pt-10 border-t border-slate-100 flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl overflow-hidden border-2 border-white shadow-xl shadow-primary/10 group-hover:rotate-3 transition-transform">
                   {item.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <p className="font-black text-xl text-slate-900 leading-tight">{item.name}</p>
                  <p className="text-xs text-primary font-black uppercase tracking-widest">{item.role}</p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{item.clinic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
