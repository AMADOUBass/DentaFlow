'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { saveToothCondition } from '@/server/actions/dpi'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, X, CheckCircle2 } from 'lucide-react'

export function DentalChart({ patientId, initialConditions = [], onToothClick }: { 
  patientId: string, 
  initialConditions?: any[], 
  onToothClick?: (num: number) => void 
}) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSaveCondition = async (condition: string) => {
    if (!selectedTooth) return
    setIsSaving(true)
    try {
      await saveToothCondition({
        patientId,
        toothNumber: selectedTooth,
        condition,
        notes: `Signalé via l'odonthogramme`
      })
      toast.success(`Condition ${condition} enregistrée pour la dent ${selectedTooth}`)
      setSelectedTooth(null)
      router.refresh()
    } catch (error) {
      toast.error('Erreur lors de l’enregistrement')
    } finally {
      setIsSaving(false)
    }
  }

  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11]
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28]
  
  const handleToothClick = (num: number) => {
    setSelectedTooth(num)
    if (onToothClick) onToothClick(num)
  }

  return (
    <div className="space-y-6">
      {selectedTooth && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl animate-in slide-in-from-top-4 duration-300 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl">
                 {selectedTooth}
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dent sélectionnée</p>
                 <p className="font-bold">Appliquer une condition</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <Select onValueChange={handleSaveCondition} disabled={isSaving}>
                 <SelectTrigger className="w-[200px] h-12 bg-white/10 border-none rounded-xl font-bold">
                    <SelectValue placeholder="Choisir..." />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-none shadow-2xl">
                    <SelectItem value="CARIES" className="font-bold text-rose-500">Carie</SelectItem>
                    <SelectItem value="FILLING" className="font-bold text-sky-500">Obturation</SelectItem>
                    <SelectItem value="CROWN" className="font-bold text-amber-500">Couronne</SelectItem>
                    <SelectItem value="ABSENT" className="font-bold text-slate-400">Absent</SelectItem>
                    <SelectItem value="ENDO" className="font-bold text-purple-500">Endo (T.C.)</SelectItem>
                 </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedTooth(null)}
                className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl"
              >
                Annuler
              </Button>
           </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-x-auto">
        <div className="min-w-[800px] flex flex-col gap-12">
          <div className="flex justify-center gap-2">
            <div className="flex gap-1 pr-4 border-r-2 border-slate-100">
              {upperRight.map(num => (
                <Tooth key={num} number={num} isActive={selectedTooth === num} onClick={() => handleToothClick(num)} />
              ))}
            </div>
            <div className="flex gap-1 pl-4">
              {upperLeft.map(num => (
                <Tooth key={num} number={num} isActive={selectedTooth === num} onClick={() => handleToothClick(num)} />
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
             <div className="flex gap-1 pr-4 border-r-2 border-slate-100">
              {[48, 47, 46, 45, 44, 43, 42, 41].reverse().map(num => (
                <Tooth key={num} number={num} isActive={selectedTooth === num} onClick={() => handleToothClick(num)} position="lower" />
              ))}
            </div>
            <div className="flex gap-1 pl-4">
              {[31, 32, 33, 34, 35, 36, 37, 38].reverse().map(num => (
                <Tooth key={num} number={num} isActive={selectedTooth === num} onClick={() => handleToothClick(num)} position="lower" />
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6">
             <LegendItem color="bg-rose-500" label="Carie" />
             <LegendItem color="bg-sky-500" label="Obturation" />
             <LegendItem color="bg-amber-500" label="Couronne" />
             <LegendItem color="bg-slate-200" label="Absent" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Tooth({ number, isActive, onClick, position = 'upper' }: any) {
  return (
    <div onClick={onClick} className={cn("flex flex-col items-center gap-2 cursor-pointer transition-all", isActive ? "scale-110" : "hover:scale-105")}>
      {position === 'lower' && <span className="text-[10px] font-black text-slate-400">{number}</span>}
      <div className={cn("relative w-10 h-12 border-2 rounded-lg flex items-center justify-center bg-white p-1", isActive ? "border-primary border-4 shadow-lg shadow-primary/20" : "border-slate-100")}>
        <svg viewBox="0 0 100 120" className="w-full h-full">
           <path d="M20,20 Q50,0 80,20 L85,80 Q50,110 15,80 Z" className={cn("fill-white stroke-slate-200 stroke-[4]", isActive && "stroke-primary")} />
        </svg>
      </div>
      {position === 'upper' && <span className="text-[10px] font-black text-slate-400">{number}</span>}
    </div>
  )
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full", color)} />
      <span className="text-[10px] font-black uppercase text-slate-400">{label}</span>
    </div>
  )
}
