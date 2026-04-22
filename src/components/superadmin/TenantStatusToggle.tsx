'use client'

import { useState } from 'react'
import { updateTenantStatusAction } from '@/server/superadmin'
import { Button } from '@/components/ui/button'
import { Loader2, ShieldCheck, ShieldX, Eye } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TenantStatusToggleProps {
  tenantId: string
  initialValidated: boolean
  initialActive: boolean
}

export function TenantStatusToggle({ tenantId, initialValidated, initialActive }: TenantStatusToggleProps) {
  const [isValidated, setIsValidated] = useState(initialValidated)
  const [isActive, setIsActive] = useState(initialActive)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleValidation = async () => {
    setIsLoading(true)
    try {
      const newStatus = !isValidated
      await updateTenantStatusAction(tenantId, { isValidated: newStatus })
      setIsValidated(newStatus)
      toast.success(newStatus ? "Clinique validée avec succès" : "Validation retirée")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async () => {
    setIsLoading(true)
    try {
      const newStatus = !isActive
      await updateTenantStatusAction(tenantId, { isActive: newStatus })
      setIsActive(newStatus)
      toast.success(newStatus ? "Clinique réactivée" : "Clinique suspendue")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4 text-slate-400" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2 bg-white">
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions Plateforme</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50" />
        <DropdownMenuItem onClick={handleToggleValidation} className="rounded-xl px-3 py-3 font-bold text-sm cursor-pointer hover:bg-slate-50">
          {isValidated ? (
            <span className="flex items-center gap-2 text-rose-600"><ShieldX className="h-4 w-4" /> Retirer Validation</span>
          ) : (
            <span className="flex items-center gap-2 text-emerald-600"><ShieldCheck className="h-4 w-4" /> Valider la clinique</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleActive} className="rounded-xl px-3 py-3 font-bold text-sm cursor-pointer hover:bg-slate-50">
          {isActive ? (
            <span className="flex items-center gap-2 text-rose-600"><ShieldX className="h-4 w-4" /> Suspendre l'accès</span>
          ) : (
            <span className="flex items-center gap-2 text-blue-600"><ShieldCheck className="h-4 w-4" /> Réactiver l'accès</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-50" />
        <DropdownMenuItem className="rounded-xl px-3 py-3 font-bold text-sm text-slate-400 cursor-not-allowed italic">
          <Eye className="h-4 w-4" /> Voir détails (Loi 25 restricted)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MoreVertical(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}
