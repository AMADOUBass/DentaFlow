'use client'

import { useState } from 'react'
import { ExternalLink, Copy, Check, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function REQVerifier({ neq }: { neq: string | null }) {
  const [copied, setCopied] = useState(false)

  if (!neq) return <span className="text-slate-400 italic">Non renseigné</span>

  const handleCopy = () => {
    navigator.clipboard.writeText(neq)
    setCopied(true)
    toast.success('NEQ copié dans le presse-papier')
    setTimeout(() => setCopied(false), 2000)
  }

  const reqUrl = "https://www.registreentreprises.gouv.qc.ca/REQNA/GR/GR03/GR03A71.RechercheRegistre.MVC/GR03A71/RechercheParEntreprise/Rechercher"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 group">
        <code className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-black text-slate-700 tracking-wider">
          {neq}
        </code>
        <button 
          onClick={handleCopy}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-primary"
          title="Copier le NEQ"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => window.open(reqUrl, '_blank')}
        className="h-8 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200 gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all"
      >
        <Search className="h-3 w-3" /> Vérifier sur le REQ
      </Button>
    </div>
  )
}
