import { AlertCircle, ArrowUpCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UpgradeBannerProps {
  title: string
  description: string
  planTier: string
}

export function UpgradeBanner({ title, description, planTier }: UpgradeBannerProps) {
  return (
    <div className="p-6 rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-200 animate-in slide-in-from-top-4 duration-500 overflow-hidden relative group">
       {/* Decoration */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

       <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-primary" />
             </div>
             <div>
                <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                <p className="text-white/60 text-sm font-medium mt-1 leading-relaxed max-w-md">
                   {description}
                </p>
             </div>
          </div>

          <Link href="/admin/settings/billing">
             <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 gap-2 shrink-0 group">
                Passer au forfait supérieur 
                <ArrowUpCircle className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
             </Button>
          </Link>
       </div>
    </div>
  )
}
