'use client'

import { useState, useTransition } from 'react'
import { createWebhookEndpoint, deleteWebhookEndpoint } from '@/server/actions/integrations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Webhook, Plus, Trash2, CheckSquare, Square } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const AVAILABLE_EVENTS = [
  { id: 'appointment.created', label: 'Rendez-vous créé' },
  { id: 'appointment.cancelled', label: 'Rendez-vous annulé' },
  { id: 'patient.created', label: 'Patient créé' },
  { id: 'patient.updated', label: 'Patient modifié' },
]

interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: string
}

interface Props {
  initialEndpoints: WebhookEndpoint[]
}

export function WebhooksSection({ initialEndpoints }: Props) {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>(initialEndpoints)
  const [url, setUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggleEvent(eventId: string) {
    setSelectedEvents(prev =>
      prev.includes(eventId) ? prev.filter(e => e !== eventId) : [...prev, eventId]
    )
  }

  async function handleAdd() {
    setError(null)
    startTransition(async () => {
      try {
        const result = await createWebhookEndpoint({ url, events: selectedEvents })
        setEndpoints(prev => [result, ...prev])
        setUrl('')
        setSelectedEvents([])
      } catch (e: any) {
        setError(e.message)
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce webhook ?')) return
    startTransition(async () => {
      try {
        await deleteWebhookEndpoint(id)
        setEndpoints(prev => prev.filter(ep => ep.id !== id))
      } catch (e: any) {
        setError(e.message)
      }
    })
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
            <Webhook className="h-5 w-5 text-sky-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Webhooks</h2>
        </div>
        <p className="text-sm text-slate-500 ml-[52px]">
          Les événements sont envoyés en POST avec une signature <code className="bg-slate-100 px-1 rounded text-xs">x-oros-signature</code> (HMAC-SHA256).
        </p>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h3 className="font-bold text-slate-700 text-sm">Ajouter un endpoint</h3>
          <Input
            placeholder="https://votre-serveur.com/webhook"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="rounded-xl border-slate-200 bg-white"
          />
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Événements à écouter</p>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_EVENTS.map(evt => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => toggleEvent(evt.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                    selectedEvents.includes(evt.id)
                      ? 'bg-sky-50 border-sky-200 text-sky-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-sky-200'
                  }`}
                >
                  {selectedEvents.includes(evt.id)
                    ? <CheckSquare className="h-4 w-4 shrink-0" />
                    : <Square className="h-4 w-4 shrink-0 text-slate-300" />
                  }
                  {evt.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={isPending || !url.trim() || selectedEvents.length === 0}
            className="rounded-xl font-bold gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter le webhook
          </Button>
        </div>

        {error && (
          <p className="text-sm text-rose-600 font-medium">{error}</p>
        )}

        {endpoints.length === 0 ? (
          <p className="text-slate-400 text-sm italic text-center py-8">
            Aucun webhook configuré. Ajoutez-en un ci-dessus.
          </p>
        ) : (
          <div className="space-y-3">
            {endpoints.map(ep => (
              <div
                key={ep.id}
                className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] font-black rounded-lg ${ep.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {ep.isActive ? 'ACTIF' : 'INACTIF'}
                    </Badge>
                    <span className="text-sm font-mono text-slate-700 truncate">{ep.url}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(ep.events as string[]).map(evt => (
                      <span key={evt} className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-sky-100">
                        {evt}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Ajouté le {format(new Date(ep.createdAt), 'd MMM yyyy', { locale: fr })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(ep.id)}
                  disabled={isPending}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl shrink-0 ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
