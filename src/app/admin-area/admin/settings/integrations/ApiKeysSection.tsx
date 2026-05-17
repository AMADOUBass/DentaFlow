'use client'

import { useState, useTransition } from 'react'
import { generateApiKey, revokeApiKey } from '@/server/actions/integrations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Key, Plus, Copy, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ApiKey {
  id: string
  name: string
  last4: string
  createdAt: string
  lastUsedAt: string | null
}

interface Props {
  initialKeys: ApiKey[]
}

export function ApiKeysSection({ initialKeys }: Props) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
  const [newKeyName, setNewKeyName] = useState('')
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleGenerate() {
    if (!newKeyName.trim()) return
    setError(null)
    startTransition(async () => {
      try {
        const result = await generateApiKey(newKeyName.trim())
        setRevealedKey(result.rawKey)
        setKeys(prev => [{ id: result.id, name: result.name, last4: result.last4, createdAt: new Date(result.createdAt).toISOString(), lastUsedAt: null }, ...prev])
        setNewKeyName('')
      } catch (e: any) {
        setError(e.message)
      }
    })
  }

  async function handleRevoke(id: string) {
    if (!confirm('Révoquer cette clé ? Cette action est irréversible.')) return
    startTransition(async () => {
      try {
        await revokeApiKey(id)
        setKeys(prev => prev.filter(k => k.id !== id))
      } catch (e: any) {
        setError(e.message)
      }
    })
  }

  function handleCopy() {
    if (!revealedKey) return
    navigator.clipboard.writeText(revealedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
            <Key className="h-5 w-5 text-violet-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Clés API</h2>
        </div>
        <p className="text-sm text-slate-500 ml-[52px]">
          Utilisez une clé API comme Bearer Token dans l'en-tête <code className="bg-slate-100 px-1 rounded text-xs">Authorization</code>.
        </p>
      </div>

      <div className="p-8 space-y-6">
        {revealedKey && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-black text-sm">
              <AlertTriangle className="h-4 w-4" />
              Copiez cette clé maintenant — elle ne sera plus jamais affichée.
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 break-all">
                {revealedKey}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0 rounded-xl border-amber-200 hover:bg-amber-100"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <button
              onClick={() => setRevealedKey(null)}
              className="text-xs text-amber-600 font-bold hover:underline"
            >
              J'ai copié la clé, fermer
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <Input
            placeholder="Nom de la clé (ex: Logiciel de facturation)"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            className="rounded-xl border-slate-200"
          />
          <Button
            onClick={handleGenerate}
            disabled={isPending || !newKeyName.trim()}
            className="rounded-xl font-bold shrink-0 gap-2"
          >
            <Plus className="h-4 w-4" />
            Générer
          </Button>
        </div>

        {error && (
          <p className="text-sm text-rose-600 font-medium">{error}</p>
        )}

        {keys.length === 0 ? (
          <p className="text-slate-400 text-sm italic text-center py-8">
            Aucune clé API active. Générez-en une ci-dessus.
          </p>
        ) : (
          <div className="space-y-3">
            {keys.map(key => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{key.name}</span>
                    <Badge variant="outline" className="text-[10px] font-black rounded-lg border-slate-200 text-slate-500">
                      ••••{key.last4}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Créée le {format(new Date(key.createdAt), 'd MMM yyyy', { locale: fr })}
                    {key.lastUsedAt && (
                      <> · Utilisée le {format(new Date(key.lastUsedAt), 'd MMM yyyy', { locale: fr })}</>
                    )}
                    {!key.lastUsedAt && ' · Jamais utilisée'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRevoke(key.id)}
                  disabled={isPending}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
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
