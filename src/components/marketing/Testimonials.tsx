'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'

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
    <section className="py-32 relative overflow-hidden bg-slate-50/50">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xl text-slate-500 font-medium">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div 
              key={i} 
              className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              <div className="absolute -top-6 -left-2 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-12 group-hover:rotate-0 transition-transform">
                <Quote className="h-6 w-6 text-white" />
              </div>

              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-700 text-lg font-medium leading-relaxed italic flex-grow mb-8">
                "{item.content}"
              </p>

              <div className="pt-8 border-t border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black text-lg overflow-hidden border-2 border-white shadow-sm">
                   {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-tight">{item.name}</h4>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">{item.role}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{item.clinic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
