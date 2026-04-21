import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  MessageSquare,
  Lock
} from 'lucide-react'
import { logout } from '@/server/auth'

import { getAdminUser } from '@/lib/auth-utils'
import { MobileNav } from '@/components/admin/mobile-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAdminUser()
  const tenant = user.tenant!

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group transition-all">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border overflow-hidden p-1.5 grayscale-0">
               {tenant.logoUrl ? (
                  <Image src={tenant.logoUrl} alt={tenant.name} width={40} height={40} className="object-contain" />
               ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm">
                     {tenant.name.charAt(0)}
                  </div>
               )}
            </div>
            <div className="min-w-0">
               <span className="font-black text-sm tracking-tight text-slate-800 block truncate group-hover:text-primary transition-colors">{tenant.name}</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administration</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 pt-4">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary/5 text-primary"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            href="/admin/appointments" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Rendez-vous
          </Link>
          <Link 
            href="/admin/patients" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <Users className="h-4 w-4" />
            Patients
          </Link>
          <Link 
            href="/admin/messages" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
        </nav>

        <div className="p-4 border-t space-y-1">
          <Link 
            href="/admin/settings/security" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <Lock className="h-4 w-4" />
            Sécurité (Loi 25)
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <Settings className="h-4 w-4" />
            Configuration
          </Link>
          <form action={logout}>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left transition-colors">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 lg:max-w-md">
            <MobileNav 
              tenantName={tenant.name}
              userName={user.name}
              userRole={user.role}
              logoUrl={tenant.logoUrl}
            />
            <div className="hidden sm:flex items-center flex-1 max-w-sm relative">
               <Search className="absolute left-3 h-4 w-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Rechercher..." 
                 className="w-full bg-slate-100/50 border-none rounded-xl pl-10 h-10 text-xs focus:ring-2 ring-primary/20 transition-all font-medium"
               />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="rounded-full relative">
               <Bell className="h-5 w-5 text-slate-500" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
             </Button>
             <div className="flex items-center gap-3 ml-2 border-l pl-4">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-black text-slate-800 leading-none">{user.name}</p>
                 <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">{user.role}</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-white shadow-sm flex items-center justify-center text-primary font-black">
                 {user.name.charAt(0)}
               </div>
             </div>
          </div>
        </header>

        <main className="p-4 md:p-10 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-white/40 rounded-[2.5rem] p-1 md:p-0">
               {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
