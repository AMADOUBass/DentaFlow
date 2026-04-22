'use client'

import { useState } from 'react'
import { Bug, Send, X, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export function BugReportButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = () => {
    // Simulation d'envoi (On pourrait envoyer à un canal Slack ou une DB)
    console.log("[BUG REPORT]:", message)
    setIsSent(true)
    setTimeout(() => {
      setIsSent(false)
      setIsOpen(false)
      setMessage('')
    }, 2000)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 print:hidden">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-slate-900 shadow-2xl shadow-slate-400 hover:scale-110 transition-all group"
        >
          <MessageSquare className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
        </Button>
      ) : (
        <Card className="w-80 border-none shadow-2xl rounded-[2rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-slate-900 p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Bug className="h-4 w-4 text-primary" /> Signaler un bug
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {isSent ? (
              <div className="py-8 text-center space-y-2 animate-in zoom-in">
                 <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-6 w-6 text-emerald-600" />
                 </div>
                 <p className="text-sm font-bold text-slate-900">Merci !</p>
                 <p className="text-xs text-slate-500">Votre rapport a été transmis à l'équipe technique.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Un problème avec l'odonthogramme ou une facture ? Dites-nous tout.
                </p>
                <Textarea 
                  placeholder="Décrivez le problème..."
                  className="rounded-xl border-slate-100 bg-slate-50 h-32 text-sm focus:bg-white"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={!message}
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 font-black gap-2"
                >
                  Envoyer le rapport <Send className="h-3 w-3" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
