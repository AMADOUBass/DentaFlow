'use client'

import { useState } from 'react'
import { Bell, Mail, MessageSquare, Save, Smartphone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function NotificationsSettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Préférences de notification mises à jour.")
    }, 1000)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-slate-500 mt-2">Configurez comment vous et vos patients recevez les alertes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-black">Rappels de Rendez-vous</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-slate-900">Rappels par SMS</Label>
                <p className="text-sm text-slate-500">Envoyé 24h avant le rendez-vous.</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-slate-900">Rappels par Courriel</Label>
                <p className="text-sm text-slate-500">Envoyé 48h avant le rendez-vous.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-white border-b p-8">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-black text-slate-900">Alertes Administrateur</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-2xl border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-slate-900">Nouvelles demandes d'urgence</Label>
                <p className="text-sm text-slate-500">Recevoir un SMS immédiat pour toute urgence.</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-2xl border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-slate-900">Rapport journalier</Label>
                <p className="text-sm text-slate-500">Résumé des activités envoyé par email chaque soir.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-primary font-black uppercase tracking-widest text-xs gap-2 shadow-xl"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer les préférences
        </Button>
      </div>
    </div>
  )
}
