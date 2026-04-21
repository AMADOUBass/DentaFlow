import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
  User as UserIcon, 
  Calendar as CalendarIcon, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Menu
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { logout } from '@/server/auth'

interface PatientLayoutProps {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

export default async function PatientPortalLayout({ children, params }: PatientLayoutProps) {
  const { tenant: tenantSlug } = await params
  const supabase = await createClient()

  // 1. Check for logged in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    redirect(`/login/patient`)
  }

  // 2. Fetch tenant and patient
  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
  if (!tenant) redirect('/')

  const patient = await prisma.patient.findUnique({
    where: { 
      tenantId_email: { 
        tenantId: tenant.id, 
        email: user.email 
      } 
    }
  })

  // 3. Security: If user is logged in but not a patient of this clinic, block access
  if (!patient) {
    // Optional: We could automatically create the patient if they exist in Supabase but not in this Tenant
    // But per our decision: Access only if already in the DB.
    redirect('/')
  }

  const navItems = [
    { label: 'Accueil', href: `/${tenantSlug}/portail`, icon: ShieldCheck },
    { label: 'Mes Rendez-vous', href: `/${tenantSlug}/portail/rendez-vous`, icon: CalendarIcon },
    { label: 'Mon Profil', href: `/${tenantSlug}/portail/profil`, icon: UserIcon },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Patient Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border overflow-hidden p-1.5">
              {tenant.logoUrl ? (
                <Image src={tenant.logoUrl} alt={tenant.name} width={40} height={40} className="object-contain" />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm">
                  {tenant.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
               <h2 className="font-black text-slate-900 tracking-tight leading-none">{tenant.name}</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Espace Patient</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
             {navItems.map((item) => (
               <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="font-bold gap-2 text-slate-600 hover:text-primary rounded-xl px-4">
                    <item.icon className="h-4 w-4" /> {item.label}
                  </Button>
               </Link>
             ))}
             <div className="w-px h-6 bg-slate-100 mx-4" />
             <form action={logout}>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 rounded-xl">
                  <LogOut className="h-5 w-5" />
                </Button>
             </form>
          </div>

          {/* Mobile menu (Simple) */}
          <div className="md:hidden">
             <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-6 w-6 text-slate-600" />
             </Button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border flex items-center justify-center text-xl font-black text-slate-700">
             {patient.firstName[0]}{patient.lastName[0]}
           </div>
           <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">Bonjour, {patient.firstName} !</p>
              <p className="text-sm text-slate-500 font-medium">Heureux de vous revoir chez {tenant.name}.</p>
           </div>
        </div>
        
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
               Sécurisé par Oros — Logiciel de gestion dentaire
            </p>
         </div>
      </footer>
    </div>
  )
}
