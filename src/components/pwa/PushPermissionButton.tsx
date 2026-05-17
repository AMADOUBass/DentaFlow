'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  tenantId: string
}

export function PushPermissionButton({ tenantId }: Props) {
  const [status, setStatus] = useState<'unsupported' | 'default' | 'granted' | 'denied'>('unsupported')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    setStatus(Notification.permission as any)
  }, [])

  async function subscribe() {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) return

    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('denied')
        return
      }

      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      const sub = existing ?? await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.toJSON().keys?.p256dh, auth: sub.toJSON().keys?.auth },
          tenantId
        })
      })

      setStatus('granted')
    } catch (err) {
      console.error('[Push] Subscribe error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function unsubscribe() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint })
        })
        await sub.unsubscribe()
      }
      setStatus('default')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'unsupported') return null

  if (status === 'granted') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={unsubscribe}
        disabled={loading}
        className="rounded-xl gap-2 text-xs font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        <BellRing className="h-3.5 w-3.5" />
        Notifications activées
      </Button>
    )
  }

  if (status === 'denied') {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <BellOff className="h-3.5 w-3.5" />
        Notifications bloquées (modifier dans les paramètres du navigateur)
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={subscribe}
      disabled={loading}
      className="rounded-xl gap-2 text-xs font-bold"
    >
      <Bell className="h-3.5 w-3.5" />
      {loading ? 'Activation...' : 'Activer les rappels push'}
    </Button>
  )
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}
