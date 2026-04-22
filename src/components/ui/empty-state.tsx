import { LucideIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  icon: LucideIcon
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border-2 border-dashed border-slate-100 rounded-[3rem] space-y-6 min-h-[400px] animate-in fade-in zoom-in duration-700">
      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center relative">
         <Icon className="h-10 w-10 text-slate-400" />
         <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full border-4 border-white animate-pulse" />
      </div>
      
      <div className="space-y-2 max-w-sm">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-sm font-medium text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && (
        <Button 
          onClick={onAction}
          className="rounded-2xl h-12 px-8 bg-slate-900 hover:bg-slate-800 font-black gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> {actionLabel}
        </Button>
      )}
    </div>
  )
}
