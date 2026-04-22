'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  FileText
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface AnalyticsDashboardProps {
  revenueData: {
    totalRevenue: number
    practitionerData: Array<{ name: string; value: number }>
    trendData: Array<{ date: string; revenue: number }>
  }
  operationalMetrics: {
    totalAppointments: number
    completionRate: number
    noShowRate: number
    stats: Array<{ name: string; value: number; color: string }>
  }
  auditSummary: {
    sensitiveAccessCount: number
    status: string
    recentLogs: any[]
  }
}

export function AnalyticsDashboard({ 
  revenueData, 
  operationalMetrics, 
  auditSummary 
}: AnalyticsDashboardProps) {
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Top High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="border-none shadow-sm rounded-[2rem] bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all" />
            <CardContent className="p-7 relative z-10">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/10 rounded-2xl">
                     <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none">+18%</Badge>
               </div>
               <div className="mt-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chiffre d'Affaire Total</p>
                  <h3 className="text-3xl font-black mt-1">{(revenueData.totalRevenue / 100).toFixed(2)}$</h3>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-sm rounded-[2rem] bg-white border border-slate-100 group">
            <CardContent className="p-7">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                     <Calendar className="h-6 w-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <Badge className="bg-blue-50 text-blue-600 border-none">{operationalMetrics.totalAppointments} RDV</Badge>
               </div>
               <div className="mt-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux de Complétion</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{operationalMetrics.completionRate.toFixed(1)}%</h3>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-sm rounded-[2rem] bg-white border border-slate-100 group">
            <CardContent className="p-7">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-rose-50 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all">
                     <Activity className="h-6 w-6 text-rose-600 group-hover:text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-rose-600 font-bold text-xs">
                     <ArrowDownRight className="h-3 w-3" /> 2%
                  </div>
               </div>
               <div className="mt-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux de No-Show</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{operationalMetrics.noShowRate.toFixed(1)}%</h3>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-sm rounded-[2rem] bg-white border border-slate-100 group">
            <CardContent className="p-7">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                     <ShieldCheck className="h-6 w-6 text-emerald-600 group-hover:text-white" />
                  </div>
                  <Badge className={cn(
                    "border-none font-bold",
                    auditSummary.status === 'Normal' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {auditSummary.status}
                  </Badge>
               </div>
               <div className="mt-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accès Loi 25 (30j)</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{auditSummary.sensitiveAccessCount}</h3>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Revenue Trend Area Chart */}
         <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100 p-8">
            <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-xl font-black text-slate-900">Évolution du CA</CardTitle>
                  <p className="text-sm font-medium text-slate-400 mt-1">Revenus quotidiens sur la période sélectionnée</p>
               </div>
            </CardHeader>
            <CardContent className="px-0 h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData.trendData}>
                     <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} 
                        dy={10}
                     />
                     <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} 
                        tickFormatter={(val) => `${val / 100}$`}
                     />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'black', color: '#0F172A' }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#0EA5E9" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Practitioner Revenue Pie Chart */}
         <Card className="border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100 p-8">
            <CardHeader className="px-0 pt-0 pb-8 text-center">
               <CardTitle className="text-xl font-black text-slate-900">Par Praticien</CardTitle>
               <p className="text-sm font-medium text-slate-400 mt-1">Répartition des honoraires</p>
            </CardHeader>
            <CardContent className="px-0 h-[300px] relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={revenueData.practitionerData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {revenueData.practitionerData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                     <p className="text-xl font-black text-slate-900">{revenueData.practitionerData.length}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">Staff</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* 3. Bottom Row: Audit & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Appointment Status Breakdown */}
         <Card className="border-none shadow-sm rounded-[2.5rem] bg-white border border-slate-100 p-8">
            <CardHeader className="px-0 pt-0 pb-8">
               <CardTitle className="text-xl font-black text-slate-900">Performance Agenda</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
               {operationalMetrics.stats.map((stat, idx) => (
                 <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm font-black text-slate-700">
                       <span>{stat.name}</span>
                       <span>{stat.value}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${(stat.value / operationalMetrics.totalAppointments) * 100}%`,
                          backgroundColor: stat.color 
                        }}
                       />
                    </div>
                 </div>
               ))}
            </CardContent>
         </Card>

         {/* Recent Audit Logs (Loi 25) */}
         <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-50 border border-slate-100 p-8">
            <CardHeader className="px-0 pt-0 pb-6 flex flex-row items-center justify-between">
               <CardTitle className="text-xl font-black text-slate-900">Audit Loi 25</CardTitle>
               <Badge className="bg-slate-900 text-white border-none font-bold">Rapport Direct</Badge>
            </CardHeader>
            <CardContent className="px-0">
               <div className="space-y-4">
                  {auditSummary.recentLogs.map((log: any) => (
                    <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:border-primary/50 border border-transparent transition-all">
                       <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">{log.description}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                            {format(new Date(log.createdAt), 'd MMM, HH:mm', { locale: fr })}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>

    </div>
  )
}

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6']
