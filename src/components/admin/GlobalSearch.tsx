'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, User, Stethoscope, Loader2, X } from 'lucide-react'
import { globalSearchAction } from '@/server/search'
import { useDebounce } from '@/hooks/use-debounce'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ patients: any[], services: any[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const search = async () => {
      if (debouncedQuery.length < 2) {
        setResults(null)
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await globalSearchAction(debouncedQuery)
        setResults(res)
        setIsOpen(true)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [debouncedQuery])

  const handleSelect = () => {
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="hidden sm:flex items-center flex-1 max-w-sm relative z-50">
      <Search className="absolute left-4 h-4 w-4 text-slate-400" />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        placeholder="Rechercher un patient ou un soin..." 
        className="w-full bg-slate-100 border-none rounded-2xl pl-12 pr-10 h-11 text-sm focus:ring-2 ring-primary/20 font-medium placeholder:text-slate-400 transition-all"
      />
      
      {query && (
        <button 
          onClick={() => setQuery('')}
          className="absolute right-4 p-1 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="h-3 w-3 text-slate-400" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (results?.patients.length || results?.services.length || loading) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto" />
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Recherche en cours...</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto p-2">
                {results?.patients.length ? (
                  <div className="mb-4">
                    <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patients</p>
                    {results.patients.map((p) => (
                      <Link 
                        key={p.id} 
                        href={`/admin-area/admin/patients/${p.id}`}
                        onClick={handleSelect}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                      >
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{p.firstName} {p.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{p.phone}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}

                {results?.services.length ? (
                  <div>
                    <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Services</p>
                    {results.services.map((s) => (
                      <Link 
                        key={s.id} 
                        href="/admin-area/admin/services"
                        onClick={handleSelect}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                      >
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold">
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{s.durationMin} min • {s.priceCents / 100}$</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}

                {!results?.patients.length && !results?.services.length && (
                  <div className="p-8 text-center text-slate-400 italic text-sm">
                    Aucun résultat trouvé pour "{query}"
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
