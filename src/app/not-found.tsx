import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-1000">
        <div className="relative inline-flex items-center justify-center">
            {/* Main Icon with Glassmorphism */}
            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/10 border border-white/50 relative z-10 group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <Search className="h-14 w-14 text-slate-800 animate-bounce-subtle" />
            </div>
            
            {/* Floating Accents */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-12 animate-float">
               <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-6 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 text-[10px] font-black text-rose-500 uppercase tracking-widest animate-in slide-in-from-left-10 duration-700 delay-300">
               Erreur 404
            </div>
        </div>

        <div className="space-y-6">
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
             Oups ! <span className="text-primary italic">Perdu ?</span>
           </h1>
           <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
              La page que vous recherchez semble s'être envolée. <br className="hidden md:block" />
              Elle n'existe pas ou a été déplacée vers une autre clinique.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
           <Button 
            variant="outline" 
            className="w-full sm:w-auto h-16 px-10 rounded-2xl font-bold border-2 border-slate-200 hover:bg-white hover:border-primary hover:text-primary transition-all duration-300 gap-3 group" 
            asChild
           >
              <Link href="/">
                 <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> 
                 Retour
              </Link>
           </Button>
           
           <Button 
            className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-2xl shadow-slate-300 gap-3 group transition-all duration-300 active:scale-95" 
            asChild
           >
              <Link href="/">
                 <Home className="h-5 w-5 group-hover:scale-110 transition-transform" /> 
                 Accueil Oros
              </Link>
           </Button>
        </div>

        <div className="pt-16 opacity-30">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">
               SÉCURITÉ & CONFORMITÉ PAR OROS SYSTEMS
            </p>
        </div>
      </div>
    </div>
  )
}
