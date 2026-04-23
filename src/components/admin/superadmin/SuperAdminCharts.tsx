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
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, Building2 } from 'lucide-react'

interface SuperAdminChartsProps {
  growthData: {
    revenueTrend: Array<{ name: string; revenue: number }>
    tenantTrend: Array<{ name: string; tenants: number }>
  }
}

export function SuperAdminCharts({ growthData }: SuperAdminChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Revenue Growth Chart */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white border border-slate-100 p-8">
         <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Croissance du CA
               </CardTitle>
               <p className="text-sm font-medium text-slate-400 mt-1">Évolution globale des honoraires encaissés ($)</p>
            </div>
         </CardHeader>
         <CardContent className="px-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={growthData.revenueTrend}>
                  <defs>
                     <linearGradient id="colorRevenueSA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} 
                     dy={10}
                  />
                  <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} 
                     tickFormatter={(val) => `${(val / 1000).toFixed(0)}k$`}
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
                     fill="url(#colorRevenueSA)" 
                  />
               </AreaChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>

      {/* Tenant Growth Chart */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white border border-slate-100 p-8">
         <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-600" /> Nouvelles Cliniques
               </CardTitle>
               <p className="text-sm font-medium text-slate-400 mt-1">Expansion du réseau Oros</p>
            </div>
         </CardHeader>
         <CardContent className="px-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={growthData.tenantTrend}>
                  <defs>
                     <linearGradient id="colorTenantsSA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} 
                     dy={10}
                  />
                  <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} 
                  />
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     itemStyle={{ fontWeight: 'black', color: '#0F172A' }}
                  />
                  <Area 
                     type="monotone" 
                     dataKey="tenants" 
                     stroke="#10B981" 
                     strokeWidth={4} 
                     fillOpacity={1} 
                     fill="url(#colorTenantsSA)" 
                  />
               </AreaChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>

    </div>
  )
}
