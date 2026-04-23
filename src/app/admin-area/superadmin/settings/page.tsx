import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  ShieldCheck, 
  Settings2, 
  Globe, 
  Mail, 
  Lock, 
  CreditCard,
  Save
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Paramètres Globaux | SuperAdmin',
  description: 'Configuration du système Oros.',
}

export default async function SuperAdminSettings() {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Paramètres <span className="text-primary italic">Globaux</span></h1>
        <p className="text-slate-500 font-medium">Contrôle centralisé de l'infrastructure Oros.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl shadow-slate-100 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-900">Configuration Plateforme</CardTitle>
                  <CardDescription>Domaines et réglages de base du SaaS.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rootDomain" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Domaine Principal</Label>
                  <Input id="rootDomain" defaultValue="oros.homes" className="rounded-xl h-12 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Support</Label>
                  <Input id="supportEmail" defaultValue="support@oros.ca" className="rounded-xl h-12 border-slate-200" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">Inscriptions Publiques</p>
                    <p className="text-xs text-slate-500 font-medium">Autoriser les nouvelles cliniques à s'inscrire via le site marketing.</p>
                  </div>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">Mode Maintenance</p>
                    <p className="text-xs text-slate-500 font-medium">Désactiver l'accès pour tous les utilisateurs sauf les SuperAdmins.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-100 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Lock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-900">Sécurité & Conformité</CardTitle>
                  <CardDescription>Réglages Loi 25 et protection des données.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-rose-900">Purge Automatique des Logs</p>
                    <p className="text-xs text-rose-600 font-medium">Supprimer les logs d'audit de plus de 5 ans (Conformité).</p>
                  </div>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-amber-900">MFA Obligatoire</p>
                    <p className="text-xs text-amber-600 font-medium">Forcer l'authentification à deux facteurs pour tout le personnel clinique.</p>
                  </div>
                  <Switch />
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <Card className="border-none shadow-xl shadow-slate-900 bg-slate-900 rounded-[2.5rem] text-white p-8">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight">Zone de Danger</h3>
                <p className="text-sm text-slate-400 font-medium">Ces réglages affectent l'ensemble du réseau Oros. Manipulez avec précaution.</p>
              </div>
              <Button className="w-full h-14 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-lg gap-2 shadow-xl">
                <Save className="h-5 w-5" /> Sauvegarder tout
              </Button>
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-100 rounded-[2.5rem] p-8 space-y-4">
             <div className="flex items-center gap-2 text-slate-400">
                <CreditCard className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Facturation SaaS</span>
             </div>
             <p className="text-sm font-bold text-slate-600 leading-relaxed">
               L'intégration Stripe Connect est active. Vos commissions sont prélevées automatiquement sur chaque transaction.
             </p>
             <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-100 hover:bg-slate-50">
               Ouvrir Stripe Dashboard
             </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
