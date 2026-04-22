'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Lock, Unlock, Plus, User, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

import { useState } from 'react'
import { createClinicalNote, lockClinicalNote } from '@/server/actions/dpi'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ClinicalNotes({ patientId, initialNotes = [] }: { patientId: string, initialNotes?: any[] }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleCreateNote = async (locked: boolean = false) => {
    if (!content.trim()) return
    
    setIsSubmitting(true)
    try {
      const note = await createClinicalNote({
        patientId,
        content,
        type: 'GENERIC'
      })

      if (locked) {
        await lockClinicalNote(note.id, patientId)
        toast.success('Note clinique créée et verrouillée avec succès')
      } else {
        toast.success('Brouillon enregistré')
      }

      setContent('')
      router.refresh()
    } catch (error) {
      toast.error('Erreur lors de l’enregistrement')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
               <FileText className="h-6 w-6" />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 leading-none">Notes de Soins</h3>
               <p className="text-sm font-medium text-slate-400 mt-1">Historique clinique sécurisé</p>
            </div>
         </div>
      </div>

      {/* Quick Entry Form */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
         <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="rounded-lg font-black text-[10px] uppercase text-primary border-primary/20 bg-primary/5">Nouveau Traitement</Badge>
         </div>
         <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            placeholder="Saisissez vos observations cliniques ici..."
            className="w-full min-h-[150px] p-6 rounded-[2rem] bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-700 font-medium placeholder:text-slate-300 transition-all resize-none"
         />
         <div className="flex justify-between items-center pt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
               <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sauvegarde manuelle requise
            </p>
            <div className="flex gap-4">
               <Button 
                 variant="ghost" 
                 disabled={isSubmitting || !content}
                 onClick={() => handleCreateNote(false)}
                 className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 px-6"
               >
                  Brouillon
               </Button>
               <Button 
                 disabled={isSubmitting || !content}
                 onClick={() => handleCreateNote(true)}
                 className="rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white px-6 shadow-xl shadow-slate-200"
               >
                  Enregistrer & Verrouiller
               </Button>
            </div>
         </div>
      </div>

      {/* Timeline of existing notes */}
      <div className="space-y-6 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-slate-100">
         {initialNotes.length === 0 ? (
           <div className="ml-16 py-12 text-slate-400 font-medium italic">Aucune note clinique enregistrée pour ce patient.</div>
         ) : (
           initialNotes.map((note) => (
             <div key={note.id} className="relative pl-16">
                <div className="absolute left-4 top-4 w-4 h-4 bg-white border-4 border-primary rounded-full z-10 shadow-sm" />
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-black text-slate-900">{note.practitioner.firstName} {note.practitioner.lastName}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{format(new Date(note.createdAt), 'd MMMM yyyy HH:mm', { locale: fr })}</span>
                      </div>
                      {note.isLocked ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1 rounded-lg">
                           <Lock className="h-3 w-3" /> Verrouillé
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 rounded-lg">
                           <Unlock className="h-3 w-3" /> Brouillon
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{note.content}</p>
                    </div>
                  </CardContent>
                </Card>
             </div>
           ))
         )}
      </div>
    </div>
  )
}
