'use client'

import { useState } from 'react'
import { Smartphone, QrCode, Globe, CheckCircle2, Download, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function MobileAppSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Application Mobile</h1>
        <p className="text-slate-500 mt-2">Gérez l'accès mobile pour vos patients et votre équipe.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary to-blue-600 p-10 text-white">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                       <Smartphone className="h-8 w-8" />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-black">Expérience Patient Native</CardTitle>
                       <CardDescription className="text-white/70">Votre clinique dans la poche de vos patients.</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                       </div>
                       <h4 className="font-bold text-slate-900">Notifications Push</h4>
                       <p className="text-xs text-slate-500 leading-relaxed">Réduisez les "no-shows" avec des rappels instantanés sur mobile.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Globe className="h-5 w-5 text-sky-500" />
                       </div>
                       <h4 className="font-bold text-slate-900">Accès au Dossier</h4>
                       <p className="text-xs text-slate-500 leading-relaxed">Vos patients peuvent consulter leurs factures et rdv 24/7.</p>
                    </div>
                 </div>

                 <div className="pt-6 border-t flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-1 space-y-1">
                       <h4 className="font-bold text-slate-900 text-lg">Statut de la PWA</h4>
                       <p className="text-sm text-slate-500">Votre application mobile est prête à être installée.</p>
                    </div>
                    <Button className="h-12 px-8 rounded-xl font-bold bg-slate-900 text-primary shadow-xl">
                       Vérifier les déploiements
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
              <div>
                 <p className="text-sm font-black text-emerald-900">Sécurité Biométrique</p>
                 <p className="text-xs text-emerald-700">L'application mobile supporte FaceID et TouchID pour un accès sécurisé au dossier patient.</p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-sm rounded-[2.5rem] bg-white text-center p-10 flex flex-col items-center gap-6">
              <h3 className="font-black text-xl text-slate-900">Installation Rapide</h3>
              <div className="w-48 h-48 bg-slate-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
                 <QrCode className="h-32 w-32 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                 Scannez ce code pour ouvrir le portail patient sur votre mobile et l'ajouter à l'écran d'accueil.
              </p>
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200 gap-2">
                 <Download className="h-4 w-4" /> Télécharger le kit QR
              </Button>
           </Card>
        </div>
      </div>
    </div>
  )
}
