'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('dentaflow_consent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('dentaflow_consent', 'true')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] max-w-2xl mx-auto"
        >
          <Card className="glass-morphism border-2 border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-6 w-6" />
                 </div>
                 <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Respect de votre vie privée</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShow(false)} className="rounded-full">
                 <X className="h-5 w-5 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Conformément à la <strong>Loi 25 du Québec</strong>, nous protégeons vos renseignements personnels. 
                Ce site utilise des témoins pour assurer son bon fonctionnement et sécuriser vos données médicales. 
                En continuant, vous acceptez nos pratiques de confidentialité.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <Button onClick={handleAccept} className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20">
                    Accepter les conditions
                 </Button>
                 <Button variant="ghost" className="w-full sm:w-auto text-primary font-bold gap-2">
                    <Info className="h-4 w-4" /> En savoir plus
                 </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
