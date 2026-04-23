import { getAdminUser } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import { Breadcrumbs } from '@/components/admin/breadcrumbs'
import { Button } from '@/components/ui/button'
import { LogOut, ShieldCheck, Globe, Activity } from 'lucide-react'
import { logout } from '@/server/auth'
import Link from 'next/link'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAdminUser()

  if (user.role !== 'SUPERADMIN') {
    redirect('/admin-area/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/superadmin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-none">Oros</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Platform Console</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/superadmin">
              <Button variant="ghost" className="rounded-xl text-xs font-bold text-slate-600 hover:text-primary">Dashboard</Button>
            </Link>
            <Link href="/admin-area/superadmin/tenants">
              <Button variant="ghost" className="rounded-xl text-xs font-bold text-slate-600 hover:text-primary">Cliniques</Button>
            </Link>
            <Link href="/admin-area/superadmin/logs">
              <Button variant="ghost" className="rounded-xl text-xs font-bold text-slate-600 hover:text-primary">Logs d'Audit</Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Système Live</span>
          </div>
          
          <form action={logout}>
            <Button variant="ghost" size="sm" className="rounded-xl text-slate-400 hover:text-rose-600 transition-colors">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumbs />
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>

      <footer className="p-12 text-center">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">
          Oros Engine — Global Administration Matrix
        </p>
      </footer>
    </div>
  )
}
