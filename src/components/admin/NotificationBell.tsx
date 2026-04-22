'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getNotificationsAction, markAsReadAction } from '@/server/notifications'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: Date
  link?: string | null
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadNotifications() {
    const data = await getNotificationsAction()
    setNotifications(data as any)
    setUnreadCount(data.filter(n => !n.isRead).length)
  }

  async function handleMarkRead(id: string) {
    await markAsReadAction(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'ERROR': return <AlertCircle className="h-4 w-4 text-rose-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-2xl h-12 w-12 hover:bg-slate-50 transition-all">
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-4 w-4 bg-rose-500 rounded-full border-2 border-white text-[10px] font-black text-white flex items-center justify-center animate-in zoom-in">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-none shadow-2xl rounded-3xl overflow-hidden" align="end">
        <div className="bg-slate-900 p-6 text-white">
           <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
             <Bell className="h-4 w-4 text-primary" /> Notifications
           </h3>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-10 text-center space-y-2">
               <p className="text-sm font-bold text-slate-900">Tout est calme ici</p>
               <p className="text-xs text-slate-400">Aucune notification pour le moment.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-5 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors group ${!n.isRead ? 'bg-blue-50/30' : ''}`}
              >
                <div className="mt-1">{getIcon(n.type)}</div>
                <div className="flex-1 space-y-1">
                   <p className={`text-sm font-bold ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                     {n.title}
                   </p>
                   <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                     {n.message}
                   </p>
                   <p className="text-[10px] text-slate-300 font-medium">
                     {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}
                   </p>
                </div>
                {!n.isRead && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <Check className="h-3 w-3 text-emerald-600" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-50 text-center">
             <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">
               Voir tout l'historique
             </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
