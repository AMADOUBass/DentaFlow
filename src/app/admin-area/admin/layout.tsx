import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Bell,
  Search,
} from 'lucide-react'
import { getAdminUser } from '@/lib/auth-utils'
import { MobileNav } from '@/components/admin/mobile-nav'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const user = await getAdminUser()
  const tenant = user.tenant!
  return {
    title: `Admin - ${tenant.name} | Oros`,
    description: `Plateforme de gestion pour ${tenant.name}`
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAdminUser()
  const tenant = user.tenant!

  return (
    <div className="flex min-h-screen bg-slate-50/50 selection:bg-primary/20">
      {/* Sidebar - Desktop */}
      <AdminSidebar tenant={{ name: tenant.name, logoUrl: tenant.logoUrl }} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 lg:max-w-md">
            <MobileNav 
              tenantName={tenant.name}
              userName={user.name}
              userRole={user.role}
              logoUrl={tenant.logoUrl}
            />
            <div className="hidden sm:flex items-center flex-1 max-w-sm relative">
               <Search className="absolute left-4 h-4 w-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Rechercher un patient ou un soin..." 
                 className="w-full bg-slate-100/50 border-none rounded-2xl pl-12 h-11 text-sm focus:ring-2 ring-primary/20 transition-all font-medium placeholder:text-slate-400"
               />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-2xl relative h-11 w-11 hover:bg-slate-100">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </Button>
             </div>

             <div className="flex items-center gap-4 ml-2 border-l pl-6">
               <div className="text-right hidden lg:block">
                 <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">{user.role.replace('_', ' ')}</p>
               </div>
               <div className="w-11 h-11 rounded-2xl bg-slate-900 shadow-lg shadow-slate-200 border-2 border-white flex items-center justify-center text-white font-black text-lg">
                 {user.name.charAt(0)}
               </div>
             </div>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               {children}
            </div>
          </div>
        </main>

        <footer className="p-8 text-center border-t bg-white/30">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            DentaFlow Platform — Système d'Exploitation Clinique Sécurisé
          </p>
        </footer>
      </div>
    </div>
  )
}
